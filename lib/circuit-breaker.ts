import { logger } from "@/lib/logger";

export enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN,
}

interface CircuitBreakerOptions {
  failureThreshold: number; // Number of failures before opening
  resetTimeout: number; // Ms to wait before half-open
}

/**
 * A simple Circuit Breaker to prevent cascading failures to downstream dependencies (like Redis).
 */
export class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failureCount = 0;
  private nextAttempt = 0;

  constructor(
    private name: string,
    private options: CircuitBreakerOptions = { failureThreshold: 3, resetTimeout: 10000 }
  ) {}

  async fire<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() > this.nextAttempt) {
        // Time to try half-open
        logger.warn(`Circuit [${this.name}] transitioning to HALF_OPEN`);
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error(`CircuitBreaker [${this.name}] is OPEN`);
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      throw err;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === CircuitState.HALF_OPEN) {
      logger.info(`Circuit [${this.name}] recovered and transitioning to CLOSED`);
      this.state = CircuitState.CLOSED;
    }
  }

  private onFailure(err: unknown) {
    this.failureCount++;
    if (this.failureCount >= this.options.failureThreshold && this.state !== CircuitState.OPEN) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.options.resetTimeout;
      logger.error(`Circuit [${this.name}] tripped to OPEN after ${this.failureCount} failures`, err);
    }
  }
  
  public isOpen() {
    return this.state === CircuitState.OPEN && Date.now() <= this.nextAttempt;
  }
}

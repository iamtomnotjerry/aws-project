# Build Stage
FROM node:20-alpine AS builder
# Security: Don't run as root even in builder if possible, but fine for simple builds
# However, Alpine's apk sometimes requires root. We proceed as is for builder.
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Run as non-root user (node is built into the node:alpine image)
RUN addgroup -g 1001 -S nodejs || true && \
    adduser -S nextjs -u 1001 || true

# Copy standalone output specifically assigned to non-root user
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# In standalone mode, Next.js generates a server.js file
CMD ["node", "server.js"]


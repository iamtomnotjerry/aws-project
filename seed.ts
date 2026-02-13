import { prisma } from "./lib/prisma";

async function main() {
  const posts = [
    {
      title: "Chào mừng đến với AWS Blog",
      content: "Đây là bài viết mẫu đầu tiên được tạo tự động để demo tính năng Blog CMS. Dự án này được tối ưu để triển khai trên hạ tầng AWS.",
      published: true,
    },
    {
      title: "Hướng dẫn triển khai Next.js lên EC2",
      content: "Sử dụng Docker và Nginx để triển khai ứng dụng Next.js giúp tăng tính ổn định và bảo mật cho hệ thống production.",
      published: true,
    },
    {
      title: "Tối ưu hóa Database với RDS",
      content: "AWS RDS PostgreSQL cung cấp khả năng tự động backup và mở rộng linh hoạt cho tầng dữ liệu của ứng dụng.",
      published: true,
    },
  ];

  console.log("Seeding database...");

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

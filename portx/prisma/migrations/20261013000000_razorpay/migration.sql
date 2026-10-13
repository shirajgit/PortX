-- AlterTable
ALTER TABLE "payment_requests" ADD COLUMN     "order_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payment_requests_order_id_key" ON "payment_requests"("order_id");

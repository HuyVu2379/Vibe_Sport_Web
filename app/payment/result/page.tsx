"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  CalendarCheck,
  Loader2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentStatus = "loading" | "success" | "cancelled" | "error";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const code = searchParams.get("code"); // PayOS: "00" = success
  const cancel = searchParams.get("cancel"); // PayOS: "true" if cancelled
  const status = searchParams.get("status"); // PayOS: "PAID" | "CANCELLED"

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("loading");

  useEffect(() => {
    // Determine payment status from PayOS callback params
    if (cancel === "true" || status === "CANCELLED") {
      setPaymentStatus("cancelled");
    } else if (code === "00" || status === "PAID") {
      setPaymentStatus("success");
    } else if (code && code !== "00") {
      setPaymentStatus("error");
    } else {
      // If no clear indicator, show success (webhook handles actual confirmation)
      // Small delay to simulate processing
      const timer = setTimeout(() => {
        setPaymentStatus("success");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [code, cancel, status]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-lg mx-auto px-4 w-full">
          {paymentStatus === "loading" && <LoadingState />}
          {paymentStatus === "success" && (
            <SuccessState orderCode={orderCode} />
          )}
          {paymentStatus === "cancelled" && (
            <CancelledState orderCode={orderCode} />
          )}
          {paymentStatus === "error" && <ErrorState orderCode={orderCode} />}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function LoadingState() {
  return (
    <GlassCard variant="elevated" className="p-8 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Đang xử lý thanh toán...</h2>
      <p className="text-muted-foreground text-sm">
        Vui lòng chờ trong giây lát
      </p>
    </GlassCard>
  );
}

function SuccessState({ orderCode }: { orderCode: string | null }) {
  return (
    <div className="space-y-6">
      {/* Success Card */}
      <GlassCard variant="elevated" glow="primary" className="p-8 text-center">
        {/* Animated Check Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-status-confirmed/20 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-status-confirmed/20 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-status-confirmed" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">
          Thanh toán{" "}
          <span className="text-status-confirmed">thành công!</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Booking của bạn đã được xác nhận. Bạn sẽ nhận được thông báo xác nhận
          trong ít phút.
        </p>

        {orderCode && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 mb-6">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Mã giao dịch:{" "}
            </span>
            <span className="font-mono font-semibold text-sm">
              {orderCode}
            </span>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <CalendarCheck className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Trạng thái</p>
            <p className="text-sm font-semibold text-status-confirmed">
              Confirmed
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <ShieldCheck className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Thanh toán</p>
            <p className="text-sm font-semibold text-status-confirmed">
              Hoàn tất
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button asChild className="w-full glow-primary" size="lg">
          <Link href="/bookings">
            <CalendarCheck className="h-5 w-5 mr-2" />
            Xem Booking của tôi
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link href="/">Quay về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}

function CancelledState({ orderCode }: { orderCode: string | null }) {
  return (
    <div className="space-y-6">
      <GlassCard
        variant="elevated"
        className="p-8 text-center border-status-hold/30"
      >
        {/* Warning Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-status-hold/15 flex items-center justify-center">
          <Clock className="h-12 w-12 text-status-hold" />
        </div>

        <h1 className="text-2xl font-bold mb-2">
          Thanh toán <span className="text-status-hold">đã hủy</span>
        </h1>
        <p className="text-muted-foreground mb-4">
          Bạn đã hủy quá trình thanh toán. Slot vẫn đang được giữ — bạn có thể
          quay lại và thử thanh toán lại trước khi HOLD hết hạn.
        </p>

        {orderCode && (
          <p className="text-xs text-muted-foreground">
            Mã đơn hàng:{" "}
            <span className="font-mono font-medium">{orderCode}</span>
          </p>
        )}
      </GlassCard>

      <div className="space-y-3">
        <Button asChild className="w-full" size="lg">
          <Link href="/booking">
            <RotateCcw className="h-5 w-5 mr-2" />
            Quay lại đặt sân
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link href="/">Quay về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}

function ErrorState({ orderCode }: { orderCode: string | null }) {
  return (
    <div className="space-y-6">
      <GlassCard
        variant="elevated"
        className="p-8 text-center border-destructive/30"
      >
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/15 flex items-center justify-center">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold mb-2">
          Thanh toán <span className="text-destructive">thất bại</span>
        </h1>
        <p className="text-muted-foreground mb-4">
          Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc chọn
          phương thức thanh toán khác.
        </p>

        {orderCode && (
          <p className="text-xs text-muted-foreground">
            Mã đơn hàng:{" "}
            <span className="font-mono font-medium">{orderCode}</span>
          </p>
        )}
      </GlassCard>

      <div className="space-y-3">
        <Button asChild className="w-full" size="lg">
          <Link href="/booking">
            <RotateCcw className="h-5 w-5 mr-2" />
            Thử lại
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link href="/bookings">Xem Booking của tôi</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}

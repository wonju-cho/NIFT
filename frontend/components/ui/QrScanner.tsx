"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { isAddress } from "ethers";
import { X } from "lucide-react";

interface QrScannerProps {
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export default function QrScanner({ onClose, onScanSuccess }: QrScannerProps) {
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false); // ✅ 중복 방지용 ref
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const safelyStopScanner = async () => {
    if (!scannerRef.current) return;

    try {
      const state = await scannerRef.current.getState();
      if (
        state === Html5QrcodeScannerState.SCANNING ||
        state === Html5QrcodeScannerState.PAUSED
      ) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (e) {
      console.warn("QR 스캐너 중단 중 오류:", e);
    } finally {
      scannerRef.current = null;
    }
  };

  const handleClose = async () => {
    await safelyStopScanner();
    onClose();
  };

  useEffect(() => {
    const init = async () => {
      const container = scannerContainerRef.current;
      if (!container) return;

      container.innerHTML = "";
      scannerRef.current = new Html5Qrcode(container.id);
      hasScannedRef.current = false; // ✅ 스캐너 시작 시 초기화

      try {
        setIsScanning(true);
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (vw, vh) => {
              const size = Math.floor(Math.min(vw, vh) * 0.7);
              return { width: size, height: size };
            },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            if (hasScannedRef.current) return; // ✅ 중복 방지
            console.log("✅ QR 스캔 성공:", decodedText);

            let addressToCheck = decodedText;
            if (decodedText.startsWith("ethereum:")) {
              addressToCheck = decodedText.substring("ethereum:".length);
            }

            if (!isAddress(addressToCheck)) {
              alert("유효하지 않은 지갑 주소입니다.");
              return;
            }

            hasScannedRef.current = true; // ✅ 한 번만 처리
            setIsScanning(false);
            onScanSuccess(addressToCheck);
            await safelyStopScanner();
          },
          () => {
            // QR 인식 실패 무시
          }
        );
      } catch (err) {
        console.error("스캐너 시작 실패:", err);
        setError("카메라를 사용할 수 없습니다.");
        setIsScanning(false);
      }
    };

    init();

    return () => {
      safelyStopScanner();
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-[90%] max-w-xs sm:max-w-sm md:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-white hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {error ? (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        ) : (
          <div className="mb-4 text-center text-lg font-semibold text-white">
            사용처의 지갑 주소를 스캔하세요
          </div>
        )}

        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-lg bg-gray-100">
          <div
            ref={scannerContainerRef}
            id="html5-qr-scanner"
            className="h-full w-full"
          />
        </div>

        <div className="mt-4 text-center text-sm text-white font-medium">
          {isScanning ? "🟢 지갑 주소를 인식해주세요" : "카메라 준비 중..."}
        </div>
      </div>
    </div>
  );
}

package com.luzdiaria.versiculos;

import android.content.Context;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

/**
 * Utilitário para piscar o LED (flash da câmera) como alerta do versículo.
 * Usa CameraManager.setTorchMode (API 23+), o método oficial do Android.
 */
public class FlashLightUtil {

    private static final String TAG = "LuzDiariaFlash";

    // Pisca o flash N vezes (intervalo de 150ms) em background thread
    public static void blinkFlash(Context context, int times) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return;
        if (!context.getPackageManager().hasSystemFeature(
                android.content.pm.PackageManager.FEATURE_CAMERA_FLASH)) {
            Log.w(TAG, "Aparelho sem flash");
            return;
        }

        final CameraManager cam = (CameraManager) context.getApplicationContext()
                .getSystemService(Context.CAMERA_SERVICE);
        if (cam == null) return;

        String cameraId = null;
        try {
            for (String id : cam.getCameraIdList()) {
                if (id != null) { cameraId = id; break; }
            }
        } catch (CameraAccessException e) {
            Log.e(TAG, "Erro ao listar câmeras", e);
            return;
        }
        if (cameraId == null) return;

        final String cid = cameraId;
        final int blinkCount = Math.max(1, Math.min(times, 10));
        final Handler handler = new Handler(Looper.getMainLooper());

        // Liga/desliga o torch com delay — rodando em thread separada para
        // não travar o receiver (que tem ~10s de janela)
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    for (int i = 0; i < blinkCount; i++) {
                        setTorch(cam, cid, true);
                        Thread.sleep(150);
                        setTorch(cam, cid, false);
                        Thread.sleep(150);
                    }
                } catch (InterruptedException e) {
                    // ignora
                } catch (Exception e) {
                    Log.e(TAG, "Erro ao piscar flash", e);
                } finally {
                    // Garante que o flash fica desligado ao final
                    try { setTorch(cam, cid, false); } catch (Exception ignored) {}
                }
            }
        }).start();
    }

    private static void setTorch(CameraManager cam, String cameraId, boolean on)
            throws CameraAccessException {
        cam.setTorchMode(cameraId, on);
    }
}

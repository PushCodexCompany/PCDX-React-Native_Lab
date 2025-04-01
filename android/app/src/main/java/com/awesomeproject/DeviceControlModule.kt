package com.awesomeproject

import android.content.Context
import android.os.PowerManager
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReactContextBaseJavaModule

class DeviceControlModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "DeviceControl"
    }

    @ReactMethod
    fun shutdown() {
        Log.d("DeviceControl", "Shutdown command received")

        try {
            val process = Runtime.getRuntime().exec(arrayOf("su", "-c", "reboot -p"))
            process.waitFor()
        } catch (e: Exception) {
            Log.e("DeviceControl", "Shutdown failed: ${e.message}")
        }
    }

    @ReactMethod
    fun restart() {
        Log.d("DeviceControl", "Restart command received")

        try {
            val process = Runtime.getRuntime().exec(arrayOf("su", "-c", "reboot"))
            process.waitFor()
        } catch (e: Exception) {
            Log.e("DeviceControl", "Restart failed: ${e.message}")
        }
    }
}
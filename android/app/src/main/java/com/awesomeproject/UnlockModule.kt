package com.awesomeproject

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class UnlockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "UnlockModule"
    }

    @ReactMethod
    fun exitKioskMode() {
        val activity = currentActivity as? MainActivity
        activity?.unlockKioskMode()
    }
}

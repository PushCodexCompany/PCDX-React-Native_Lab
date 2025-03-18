package com.awesomeproject

import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "AwesomeProject"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        hideSystemNavigationBar()
    }

    private fun hideSystemNavigationBar() {
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
            View.SYSTEM_UI_FLAG_FULLSCREEN
        )
    }

    override fun onStart() {
    super.onStart()
    startLockTask()
}

    override fun onResume() {
        super.onResume()
        hideSystemNavigationBar()
    }

    // Block the back button
    override fun onBackPressed() {
        // Do nothing
    }

    // Block the recent apps button
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        return if (keyCode == KeyEvent.KEYCODE_APP_SWITCH) {
            true
        } else {
            super.onKeyDown(keyCode, event)
        }
    }

     // Method to unlock and exit
    fun unlockKioskMode() {
        stopLockTask()
        finishAffinity()  // Close the app
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

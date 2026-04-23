package com.cardsecureview

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class CardSecureModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        companionContext = reactContext
    }

    override fun getName(): String {
        return "CardSecureModule"
    }

    @ReactMethod
    fun openSecureView(cardId: String, pan: String, cvv: String, expiry: String, holder: String, token: String, promise: Promise) {
        try {
            val activity = getCurrentActivity()
            val context = activity ?: reactApplicationContext
            val intent = Intent(context, CardSecureActivity::class.java).apply {
                putExtra("CARD_ID", cardId)
                putExtra("PAN", pan)
                putExtra("CVV", cvv)
                putExtra("EXPIRY", expiry)
                putExtra("HOLDER", holder)
                putExtra("TOKEN", token)
                if (activity == null) {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
            }
            context.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR_OPENING_ACTIVITY", e.message)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built in Event Emitter Calls.
    }

    companion object {
        private var companionContext: ReactApplicationContext? = null

        fun emitEvent(eventName: String, params: Any?) {
            companionContext
                ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, params)
        }
    }
}

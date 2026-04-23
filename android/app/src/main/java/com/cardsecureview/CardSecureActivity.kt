package com.cardsecureview

import android.os.Bundle
import android.os.CountDownTimer
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Arguments

class CardSecureActivity : AppCompatActivity() {

    private lateinit var sensitiveLayout: View
    private lateinit var timerText: TextView
    private lateinit var btnToggle: Button
    private var countDownTimer: CountDownTimer? = null
    private var cardId: String? = null
    private var isDataVisible = false

    data class CardData(val pan: String, val cvv: String, val expiry: String, val holder: String)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE)
        setContentView(R.layout.activity_card_secure)

        sensitiveLayout = findViewById(R.id.sensitiveLayout)
        timerText = findViewById(R.id.timerText)
        btnToggle = findViewById(R.id.btnToggle)
        val btnClose = findViewById<Button>(R.id.btnClose)

        cardId = intent.getStringExtra("CARD_ID")
        val token = intent.getStringExtra("TOKEN") ?: ""
        val pan = intent.getStringExtra("PAN") ?: ""
        val cvv = intent.getStringExtra("CVV") ?: ""
        val expiry = intent.getStringExtra("EXPIRY") ?: ""
        val holder = intent.getStringExtra("HOLDER") ?: ""

        CardSecureModule.emitEvent("onSecureViewOpened", cardId)

        if (!isValidToken(token)) {
            val params = Arguments.createMap().apply {
                putString("code", "INVALID_TOKEN")
                putString("message", "El token proporcionado no es válido o ha expirado")
            }
            CardSecureModule.emitEvent("onValidationError", params)
            finish()
            return
        }

        if (pan.isEmpty() || cvv.isEmpty()) {
            val params = Arguments.createMap().apply {
                putString("code", "CARD_NOT_FOUND")
                putString("message", "No se encontraron datos para la tarjeta solicitada")
            }
            CardSecureModule.emitEvent("onValidationError", params)
            finish()
            return
        }

        val card = CardData(pan, cvv, expiry, holder)

        maskData()

        btnToggle.setOnClickListener {
            if (isDataVisible) {
                maskData()
                stopTimer()
            } else {
                revealData(card)
                startTimer()
                CardSecureModule.emitEvent("onCardDataShown", cardId)
            }
        }

        btnClose.setOnClickListener {
            closeWithReason("USER_DISMISS")
        }
    }

    private fun maskData() {
        isDataVisible = false
        btnToggle.text = "Mostrar datos"
        timerText.text = ""
        timerText.visibility = View.INVISIBLE
        findViewById<TextView>(R.id.cardHolder).text = "················"
        findViewById<TextView>(R.id.cardNumber).text = "**** **** **** ****"
        findViewById<TextView>(R.id.expiryDate).text = "**/**"
        findViewById<TextView>(R.id.cvv).text = "***"
    }

    private fun revealData(card: CardData) {
        isDataVisible = true
        btnToggle.text = "Ocultar datos"
        timerText.visibility = View.VISIBLE
        findViewById<TextView>(R.id.cardHolder).text = card.holder
        findViewById<TextView>(R.id.cardNumber).text = card.pan
        findViewById<TextView>(R.id.expiryDate).text = card.expiry
        findViewById<TextView>(R.id.cvv).text = card.cvv
    }

    private fun isValidToken(token: String): Boolean {
        if (!token.startsWith("TOKEN-")) return false
        return try {
            val timestamp = token.substring(6).toLong()
            val currentTimestamp = System.currentTimeMillis() / 1000
            (currentTimestamp - timestamp) < 60
        } catch (e: Exception) {
            false
        }
    }

    private fun startTimer() {
        stopTimer()
        countDownTimer = object : CountDownTimer(30000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                timerText.text = "Cerrando en ${millisUntilFinished / 1000}s"
            }

            override fun onFinish() {
                closeWithReason("TIMEOUT")
            }
        }.start()
    }

    private fun stopTimer() {
        countDownTimer?.cancel()
        countDownTimer = null
    }

    private fun closeWithReason(reason: String) {
        val params = Arguments.createMap().apply {
            putString("cardId", cardId)
            putString("reason", reason)
        }
        CardSecureModule.emitEvent("onSecureViewClosed", params)
        finish()
    }

    override fun onPause() {
        super.onPause()
        sensitiveLayout.visibility = View.INVISIBLE
    }

    override fun onResume() {
        super.onResume()
        sensitiveLayout.visibility = View.VISIBLE
    }

    override fun onDestroy() {
        super.onDestroy()
        stopTimer()
    }
}

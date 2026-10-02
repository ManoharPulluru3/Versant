package com.versantstudent

import android.media.AudioAttributes
import android.media.MediaPlayer
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class AudioPlayerModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private var player: MediaPlayer? = null
  private var ready = false

  override fun getName(): String = "VersantAudio"

  @ReactMethod
  fun play(url: String, promise: Promise) {
    stopInternal()
    val media = MediaPlayer()
    player = media
    ready = false
    var settled = false
    media.setAudioAttributes(
      AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_MEDIA)
        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
        .build()
    )
    media.setOnPreparedListener {
      if (player !== media) return@setOnPreparedListener
      ready = true
      it.start()
      if (!settled) {
        settled = true
        promise.resolve(it.duration)
      }
    }
    media.setOnCompletionListener {
      emit("versantAudioEnded")
    }
    media.setOnErrorListener { _, what, extra ->
      if (!settled) {
        settled = true
        promise.reject("AUDIO", "Could not play the recording ($what/$extra)")
      } else {
        emit("versantAudioError")
      }
      true
    }
    try {
      media.setDataSource(url)
      media.prepareAsync()
    } catch (error: Exception) {
      stopInternal()
      if (!settled) promise.reject("AUDIO", error.message)
    }
  }

  @ReactMethod
  fun position(promise: Promise) {
    val media = player
    promise.resolve(if (media == null || !ready) 0 else media.currentPosition)
  }

  @ReactMethod
  fun pause() {
    val media = player ?: return
    try {
      if (ready && media.isPlaying) media.pause()
    } catch (_: Exception) {
    }
  }

  @ReactMethod
  fun resume(promise: Promise) {
    val media = player
    if (media == null || !ready) {
      promise.reject("AUDIO", "Nothing is loaded")
      return
    }
    try {
      media.start()
      promise.resolve(media.duration)
    } catch (error: Exception) {
      promise.reject("AUDIO", error.message)
    }
  }

  @ReactMethod
  fun seek(positionMs: Double, promise: Promise) {
    val media = player
    if (media == null || !ready) {
      promise.resolve(0)
      return
    }
    val target = positionMs.toInt().coerceAtLeast(0)
    try {
      media.seekTo(target)
      promise.resolve(target)
    } catch (error: Exception) {
      promise.reject("AUDIO", error.message)
    }
  }

  @ReactMethod
  fun stop() {
    stopInternal()
  }

  @ReactMethod
  fun addListener(eventName: String) {}

  @ReactMethod
  fun removeListeners(count: Int) {}

  private fun stopInternal() {
    ready = false
    val media = player
    player = null
    if (media == null) return
    try {
      media.stop()
    } catch (_: Exception) {
    }
    media.release()
  }

  private fun emit(name: String) {
    if (!context.hasActiveReactInstance()) return
    context
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(name, null)
  }
}

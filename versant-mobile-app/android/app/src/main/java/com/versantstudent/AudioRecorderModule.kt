package com.versantstudent

import android.media.MediaRecorder
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class AudioRecorderModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private var recorder: MediaRecorder? = null
  private var file: File? = null

  override fun getName(): String = "VersantRecorder"

  @Suppress("DEPRECATION")
  private fun newRecorder(): MediaRecorder {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) MediaRecorder(context) else MediaRecorder()
  }

  @ReactMethod
  fun start(promise: Promise) {
    stopInternal(false)
    val dir = File(context.cacheDir, "speech")
    if (!dir.exists()) dir.mkdirs()
    val out = File(dir, "take-${System.currentTimeMillis()}.m4a")
    val rec = newRecorder()
    try {
      rec.setAudioSource(MediaRecorder.AudioSource.MIC)
      rec.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
      rec.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
      rec.setOutputFile(out.absolutePath)
      rec.prepare()
      rec.start()
      recorder = rec
      file = out
      promise.resolve(out.absolutePath)
    } catch (error: Exception) {
      rec.release()
      promise.reject("RECORD", error.message)
    }
  }

  @ReactMethod
  fun stop(promise: Promise) {
    val path = file?.absolutePath
    try {
      stopInternal(false)
      if (path == null) promise.reject("RECORD", "Nothing is recording") else promise.resolve(path)
    } catch (error: Exception) {
      promise.reject("RECORD", error.message)
    }
  }

  @ReactMethod
  fun cancel() {
    stopInternal(true)
  }

  private fun stopInternal(delete: Boolean) {
    val rec = recorder
    recorder = null
    try {
      rec?.stop()
    } catch (_: Exception) {
    }
    try {
      rec?.release()
    } catch (_: Exception) {
    }
    if (delete) file?.delete()
    if (delete) file = null
  }
}

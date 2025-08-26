package com.caphog.sdk;

import android.util.Log;

import com.getcapacitor.JSObject;

import org.json.JSONException;
import org.json.JSONObject;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.HttpUrl;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CapHog {

    private final CapHogPlugin capHogPlugin;
    private String projectId;
    private final OkHttpClient client = new OkHttpClient();

    CapHog(CapHogPlugin capHogPlugin) {
        this.capHogPlugin = capHogPlugin;
    }

    public void initialize(String projectId) {
        this.projectId = projectId;
    }

    public void logEvent(String eventName, JSObject payload) {
        String url = new HttpUrl.Builder()
                .scheme("https")
                .host("caphog.com")
                .addPathSegment("api")
                .addPathSegment("v1")
                .addPathSegment("event-entries")
                .build()
                .toString();
    JSONObject eventData = getEventData(eventName, payload);
    Log.i("CapHog", "Sending event JSON: " + eventData);
    RequestBody body = RequestBody.create(eventData.toString(), MediaType.parse("application/json; charset=utf-8"));
    Request request = new Request.Builder()
        .url(url)
        .post(body)
        .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e("logEvent", "Request failed", e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    Log.e("logEvent", "Event was not sent due to an error: " + response.body().string());
                } else {
                    Log.i("logEvent", "Event successfully sent");
                }
            }
        });
    }

    private JSONObject getEventData(String eventName, JSObject payload) {
        JSONObject data = new JSONObject();
        try {
            data.put("eventName", eventName);
            data.put("projectId", projectId);
            data.put("timestamp", System.currentTimeMillis());
            data.put("platform", "android");
            data.put("device", buildDeviceData());
            data.put("app", buildAppData());
            data.put("customPayload", payload);
        } catch (Exception e) {
            Log.i("getEventData", "Error retrieving device details");
        }
        return data;
    }

    private JSONObject buildDeviceData() {
        JSONObject device = new JSONObject();
        try {
            device.put("operatingSystem", "android");
            device.put("operatingSystemVersion", android.os.Build.VERSION.RELEASE); // TODO String.valueOf(Build.VERSION.SDK_INT)
            device.put("phoneModel", android.os.Build.MODEL);
        } catch (Exception e) {
            Log.i("buildDeviceData", "Error building device info");
        }
        return device;
    }

    private JSONObject buildAppData() throws JSONException {
        JSONObject app = new JSONObject();
        try {
            PackageManager pm = capHogPlugin.getContext().getPackageManager();
            String packageName = capHogPlugin.getContext().getPackageName();
            if (packageName == null) {
                app.put("packageName", JSONObject.NULL);
                app.put("versionName", JSONObject.NULL);
                app.put("versionCode", JSONObject.NULL);
            } else {
                app.put("packageName", packageName);
                PackageInfo pInfo = pm.getPackageInfo(packageName, 0);
                app.put("versionName", pInfo.versionName != null ? pInfo.versionName : JSONObject.NULL);
                app.put("versionCode", String.valueOf(pInfo.versionCode));
            }
        } catch (Exception e) {
            Log.e("buildAppData", "Error building app info", e);
            app.put("packageName", JSONObject.NULL);
            app.put("versionName", JSONObject.NULL);
            app.put("versionCode", JSONObject.NULL);
        }
        return app;
    }
}

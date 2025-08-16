package com.caphog.sdk;

import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;

import org.json.JSONObject;

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

    private String projectId;

    private final OkHttpClient client = new OkHttpClient();


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
        RequestBody body = RequestBody.create(getEventData(eventName, payload).toString(), MediaType.parse("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e("Send analytics event", "Request failed", e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    Log.e("Send analytics event", "Event was not sent due to an error: " + response.body().string());
                } else {
                    Log.i("Send analytics event", "Event successfully sent");
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
            data.put("customPayload", payload);
        } catch (Exception e) {
            Log.i("CapHog", "Error retrieving device details");
        }
        return data;
    }
}

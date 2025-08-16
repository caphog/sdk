package com.caphog.sdk;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "CapHog")
public class CapHogPlugin extends Plugin {

    private CapHog implementation = new CapHog();

    @PluginMethod
    public void initialize(PluginCall call) {
        implementation.initialize(call.getString("projectId"));
        call.resolve();
    }

    @PluginMethod
    public void logEvent(PluginCall call) {
        String eventName = call.getString("eventName");
        if (eventName == null) {
            call.reject("eventName is missing");
            return;
        }
        implementation.logEvent(eventName, call.getObject("payload"));

        call.resolve();
    }
}

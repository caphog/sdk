package com.caphog.sdk;

import com.getcapacitor.Logger;

public class CapHog {

    public String echo(String value) {
        Logger.info("Echo", value);
        return value;
    }
}

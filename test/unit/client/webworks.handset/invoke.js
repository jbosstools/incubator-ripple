/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
describe("webworks.handset invoke", function () {
    var webworks = ripple('platform/webworks.handset/2.0.0/server'),
        Invoke = ripple('platform/webworks.handset/2.0.0/client/invoke'),
        notifications = ripple('notifications'),
        transport = ripple('platform/webworks.core/2.0.0/client/transport');

    it("raises a notification when calling invoke", function () {
        spyOn(notifications, "openNotification");

        webworks.blackberry.invoke.invoke({
            appType: "http://www.google.com"
        });

        expect(notifications.openNotification)
            .toHaveBeenCalledWith("normal", "Requested to launch: Browser application.");
    });

    describe("BrowserArguments", function () {
        beforeEach(function () {
            spyOn(transport, "call");
        });

        it("handles launching http protocol", function () {
            expect(function () {
                Invoke.invoke(Invoke.APP_BROWSER, {
                    url: "http://somewhere.com"
                });
            }).not.toThrow();
        });

        it("handles launching https protocol", function () {
            expect(function () {
                Invoke.invoke(Invoke.APP_BROWSER, {
                    url: "https://somewhere.com"
                });
            }).not.toThrow();
        });

        it("throws exception when given unsupported protocol", function () {
            expect(function () {
                Invoke.invoke(Invoke.APP_BROWSER, {
                    url: "file:///somewhere/"
                });
            }).toThrow();
        });
    });

    it("calls the correct invoke URI", function () {
        spyOn(transport, "call");

        Invoke.invoke(Invoke.APP_BROWSER);

        expect(transport.call).toHaveBeenCalledWith("blackberry/invoke/invoke", {
            get: {
                appType: "http://"
            },
            async: true
        });
    });
});

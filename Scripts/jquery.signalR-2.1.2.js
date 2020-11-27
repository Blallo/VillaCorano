/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * ASP.NET SignalR JavaScript Library v2.0.2; Copyright (C) Microsoft Corporation; https://github.com/SignalR/SignalR/blob/master/LICENSE.md
 *
 * NUGET: END LICENSE TEXT */
/* jquery.signalR.core.js */
/*global window:false */
/*!
 * ASP.NET SignalR JavaScript Library v2.1.2
 * http://signalr.net/
 *
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *
 */

/// <reference path="Scripts/jquery-1.6.4.js" />
/// <reference path="jquery.signalR.version.js" />
(function ($, window, undefined) {

    var resources = {
        nojQuery: "jQuery was not found. Please ensure jQuery is referenced before the SignalR client JavaScript file.",
        noTransportOnInit: "No transport could be initialized successfully. Try specifying a different transport or none at all for auto initialization.",
        errorOnNegotiate: "Error during negotiation request.",
        stoppedWhileLoading: "The connection was stopped during page load.",
        stoppedWhileNegotiating: "The connection was stopped during the negotiate request.",
        errorParsingNegotiateResponse: "Error parsing negotiate response.",
        errorDuringStartRequest: "Error during start request. Stopping the connection.",
        stoppedDuringStartRequest: "The connection was stopped during the start request.",
        errorParsingStartResponse: "Error parsing start response: '{0}'. Stopping the connection.",
        invalidStartResponse: "Invalid start response: '{0}'. Stopping the connection.",
        protocolIncompatible: "You are using a version of the client that isn't compatible with the server. Client version {0}, server version {1}.",
        sendFailed: "Send failed.",
        parseFailed: "Failed at parsing response: {0}",
        longPollFailed: "Long polling request failed.",
        eventSourceFailedToConnect: "EventSource failed to connect.",
        eventSourceError: "Error raised by EventSource",
        webSocketClosed: "WebSocket closed.",
        pingServerFailedInvalidResponse: "Invalid ping response when pinging server: '{0}'.",
        pingServerFailed: "Failed to ping server.",
        pingServerFailedStatusCode: "Failed to ping server.  Server responded with status code {0}, stopping the connection.",
        pingServerFailedParse: "Failed to parse ping server response, stopping the connection.",
        noConnectionTransport: "Connection is in an invalid state, there is no transport active.",
        webSocketsInvalidState: "The Web Socket transport is in an invalid state, transitioning into reconnecting.",
        reconnectTimeout: "Couldn't reconnect within the configured timeout of {0} ms, disconnecting.",
        reconnectWindowTimeout: "The client has been inactive since {0} and it has exceeded the inactivity timeout of {1} ms. Stopping the connection."
    };

    if (typeof ($) !== "function") {
        // no jQuery!
        throw new Error(resources.nojQuery);
    }

    var signalR,
        _connection,
        _pageLoaded = (window.document.readyState === "complete"),
        _pageWindow = $(window),
        _negotiateAbortText = "__Negotiate Aborted__",
        events = {
            onStart: "onStart",
            onStarting: "onStarting",
            onReceived: "onReceived",
            onError: "onError",
            onConnectionSlow: "onConnectionSlow",
            onReconnecting: "onReconnecting",
            onReconnect: "onReconnect",
            onStateChanged: "onStateChanged",
            onDisconnect: "onDisconnect"
        },
        ajaxDefaults = {
            processData: true,
            timeout: null,
            async: true,
            global: false,
            cache: false
        },
        log = function (msg, logging) {
            if (logging === false) {
                return;
            }
            var m;
            if (typeof (window.console) === "undefined") {
                return;
            }
            m = "[" + new Date().toTimeString() + "] SignalR: " + msg;
            if (window.console.debug) {
                window.console.debug(m);
            } else if (window.console.log) {
                window.console.log(m);
            }
        },

        changeState = function (connection, expectedState, newState) {
            if (expectedState === connection.state) {
                connection.state = newState;

                $(connection).triggerHandler(events.onStateChanged, [{ oldState: expectedState, newState: newState }]);
                return true;
            }

            return false;
        },

        isDisconnecting = function (connection) {
            return connection.state === signalR.connectionState.disconnected;
        },
        
        supportsKeepAlive = function (connection) {
            return connection._.keepAliveData.activated &&
                   connection.transport.supportsKeepAlive(connection);
        },

        configureStopReconnectingTimeout = function (connection) {
            var stopReconnectingTimeout,
                onReconnectTimeout;

            // Check if this connection has already been configured to stop reconnecting after a specified timeout.
            // Without this check if a connection is stopped then started events will be bound multiple times.
            if (!connection._.configuredStopReconnectingTimeout) {
                onReconnectTimeout = function (connection) {
                    var message = signalR._.format(signalR.resources.reconnectTimeout, connection.disconnectTimeout);
                    connection.log(message);
                    $(connection).triggerHandler(events.onError, [signalR._.error(message, /* source */ "TimeoutException")]);
                    connection.stop(/* async */ false, /* notifyServer */ false);
                };

                connection.reconnecting(function () {
                    var connection = this;

                    // Guard against state changing in a previous user defined even handler
                    if (connection.state === signalR.connectionState.reconnecting) {
                        stopReconnectingTimeout = window.setTimeout(function () { onReconnectTimeout(connection); }, connection.disconnectTimeout);
                    }
                });

                connection.stateChanged(function (data) {
                    if (data.oldState === signalR.connectionState.reconnecting) {
                        // Clear the pending reconnect timeout check
                        window.clearTimeout(stopReconnectingTimeout);
                    }
                });

                connection._.configuredStopReconnectingTimeout = true;
            }
        };

    signalR = function (url, qs, logging) {
        /// <summary>Creates a new SignalR connection for the given url</summary>
        /// <param name="url" type="String">The URL of the long polling endpoint</param>
        /// <param name="qs" type="Object">
        ///     [Optional] Custom querystring parameters to add to the connection URL.
        ///     If an object, every non-function member will be added to the querystring.
        ///     If a string, it's added to the QS as specified.
        /// </param>
        /// <param name="logging" type="Boolean">
        ///     [Optional] A flag indicating whether connection logging is enabled to the browser
        ///     console/log. Defaults to false.
        /// </param>

        return new signalR.fn.init(url, qs, logging);
    };

    signalR._ = {
        defaultContentType: "application/x-www-form-urlencoded; charset=UTF-8",

        ieVersion: (function () {
            var version,
                matches;

            if (window.navigator.appName === 'Microsoft Internet Explorer') {
                // Check if the user agent has the pattern "MSIE (one or more numbers).(one or more numbers)";
                matches = /MSIE ([0-9]+\.[0-9]+)/.exec(window.navigator.userAgent);

                if (matches) {
                    version = window.parseFloat(matches[1]);
                }
            }

            // undefined value means not IE
            return version;
        })(),

        error: function (message, source, context) {
            var e = new Error(message);
            e.source = source;

            if (typeof context !== "undefined") {
                e.context = context;
            }

            return e;
        },

        transportError: function (message, transport, source, context) {
            var e = this.error(message, source, context);
            e.transport = transport ? transport.name : undefined;
            return e;
        },

        format: function () {
            /// <summary>Usage: format("Hi {0}, you are {1}!", "Foo", 100) </summary>
            var s = arguments[0];
            for (var i = 0; i < arguments.length - 1; i++) {
                s = s.replace("{" + i + "}", arguments[i + 1]);
            }
            return s;
        },

        firefoxMajorVersion: function (userAgent) {
            // Firefox user agents: http://useragentstring.com/pages/Firefox/
            var matches = userAgent.match(/Firefox\/(\d+)/);
            if (!matches || !matches.length || matches.length < 2) {
                return 0;
            }
            return parseInt(matches[1], 10 /* radix */);
        },

        configurePingInterval: function (connection) {
            var config = connection._.config,
                onFail = function (error) {
                    $(connection).triggerHandler(events.onError, [error]);
                };

            if (config && !connection._.pingIntervalId && config.pingInterval) {
                connection._.pingIntervalId = window.setInterval(function () {
                    signalR.transports._logic.pingServer(connection).fail(onFail);
                }, config.pingInterval);
            }
        }
    };

    signalR.events = events;

    signalR.resources = resources;

    signalR.ajaxDefaults = ajaxDefaults;

    signalR.changeState = changeState;

    signalR.isDisconnecting = isDisconnecting;

    signalR.connectionState = {
        connecting: 0,
        connected: 1,
        reconnecting: 2,
        disconnected: 4
    };

    signalR.hub = {
        start: function () {
            // This will get replaced with the real hub connection start method when hubs is referenced correctly
            throw new Error("SignalR: Error loading hubs. Ensure your hubs reference is correct, e.g. <script src='/signalr/js'></script>.");
        }
    };

    _pageWindow.load(function () { _pageLoaded = true; });

    function validateTransport(requestedTransport, connection) {
        /// <summary>Validates the requested transport by cross checking it with the pre-defined signalR.transports</summary>
        /// <param name="requestedTransport" type="Object">The designated transports that the user has specified.</param>
        /// <param name="connection" type="signalR">The connection that will be using the requested transports.  Used for logging purposes.</param>
        /// <returns type="Object" />

        if ($.isArray(requestedTransport)) {
            // Go through transport array and remove an "invalid" tranports
            for (var i = requestedTransport.length - 1; i >= 0; i--) {
                var transport = requestedTransport[i];
                if ($.type(transport) !== "string" || !signalR.transports[transport]) {
                    connection.log("Invalid transport: " + transport + ", removing it from the transports list.");
                    requestedTransport.splice(i, 1);
                }
            }

            // Verify we still have transports left, if we dont then we have invalid transports
            if (requestedTransport.length === 0) {
                connection.log("No transports remain within the specified transport array.");
                requestedTransport = null;
            }
        } else if (!signalR.transports[requestedTransport] && requestedTransport !== "auto") {
            connection.log("Invalid transport: " + requestedTransport.toString() + ".");
            requestedTransport = null;
        } else if (requestedTransport === "auto" && signalR._.ieVersion <= 8) {
            // If we're doing an auto transport and we're IE8 then force longPolling, #1764
            return ["longPolling"];

        }

        return requestedTransport;
    }

    function getDefaultPort(protocol) {
        if (protocol === "http:") {
            return 80;
        } else if (protocol === "https:") {
            return 443;
        }
    }

    function addDefaultPort(protocol, url) {
        // Remove ports  from url.  We have to check if there's a / or end of line
        // following the port in order to avoid removing ports such as 8080.
        if (url.match(/:\d+$/)) {
            return url;
        } else {
            return url + ":" + getDefaultPort(protocol);
        }
    }

    function ConnectingMessageBuffer(connection, drainCallback) {
        var that = this,
            buffer = [];

        that.tryBuffer = function (message) {
            if (connection.state === $.signalR.connectionState.connecting) {
                buffer.push(message);

                return true;
            }

            return false;
        };

        that.drain = function () {
            // Ensure that the connection is connected when we drain (do not want to drain while a connection is not active)
            if (connection.state === $.signalR.connectionState.connected) {
                while (buffer.length > 0) {
                    drainCallback(buffer.shift());
                }
            }
        };

        that.clear = function () {
            buffer = [];
        };
    }

    signalR.fn = signalR.prototype = {
        init: function (url, qs, logging) {
            var $connection = $(this);

            this.url = url;
            this.qs = qs;
            this.lastError = null;
            this._ = {
                keepAliveData: {},
                connectingMessageBuffer: new ConnectingMessageBuffer(this, function (message) {
                    $connection.triggerHandler(events.onReceived, [message]);
                }),
                onFailedTimeoutHandle: null,
                lastMessageAt: new Date().getTime(),
                lastActiveAt: new Date().getTime(),
                beatInterval: 5000, // Default value, will only be overridden if keep alive is enabled,
                beatHandle: null,
                totalTransportConnectTimeout: 0 // This will be the sum of the TransportConnectTimeout sent in response to negotiate and connection.transportConnectTimeout
            };
            if (typeof (logging) === "boolean") {
                this.logging = logging;
            }
        },

        _parseResponse: function (response) {
            var that = this;

            if (!response) {
                return response;
            } else if (typeof response === "string") {
                return that.json.parse(response);
            } else {
                return response;
            }
        },

        _originalJson: window.JSON,

        json: window.JSON,

        isCrossDomain: function (url, aga<?xml version="1.0"?>
<doc>
    <assembly>
        <name>Microsoft.AI.ServerTelemetryChannel</name>
    </assembly>
    <members>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor">
            <summary>
            Telemetry processor for sampling telemetry at a dynamic rate before sending to Application Insights.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.samplingProcessor">
            <summary>
            Fixed-rate sampling telemetry processor.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.estimatorProcessor">
            <summary>
            Sampling percentage estimator telemetry processor.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.estimatorSettings">
            <summary>
            Sampling percentage estimator settings.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.evaluationCallback">
            <summary>
            Callback invoked every time sampling percentage is evaluated.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.#ctor(Microsoft.ApplicationInsights.Extensibility.ITelemetryProcessor)">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor"/> class.
            <param name="next">Next TelemetryProcessor in call chain.</param>
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.#ctor(Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings,Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.AdaptiveSamplingPercentageEvaluatedCallback,Microsoft.ApplicationInsights.Extensibility.ITelemetryProcessor)">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor"/> class.
            <param name="settings">Sampling percentage estimator settings.</param>
            <param name="callback">Callback invoked every time sampling percentage is evaluated.</param>
            <param name="next">Next TelemetryProcessor in call chain.</param>
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.InitialSamplingPercentage">
            <summary>
            Gets or sets initial sampling percentage applied at the start
            of the process to dynamically vary the percentage.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.MaxTelemetryItemsPerSecond">
            <summary>
            Gets or sets maximum rate of telemetry items per second
            dynamic sampling will try to adhere to.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.MinSamplingPercentage">
            <summary>
            Gets or sets minimum sampling percentage that can be set 
            by the dynamic sampling percentage algorithm.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.MaxSamplingPercentage">
            <summary>
            Gets or sets maximum sampling percentage that can be set 
            by the dynamic sampling percentage algorithm.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.EvaluationInterval">
            <summary>
            Gets or sets duration of the sampling percentage evaluation interval.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.SamplingPercentageDecreaseTimeout">
            <summary>
            Gets or sets a value indicating how long to not to decrease
            sampling percentage after last change to prevent excessive fluctuation.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.SamplingPercentageIncreaseTimeout">
            <summary>
            Gets or sets a value indicating how long to not to increase
            sampling percentage after last change to prevent excessive fluctuation.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.MovingAverageRatio">
            <summary>
            Gets or sets exponential moving average ratio (factor) applied
            during calculation of rate of telemetry items produced by the application.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.Process(Microsoft.ApplicationInsights.Channel.ITelemetry)">
            <summary>
            Processes telemetry item.
            </summary>
            <param name="item">Telemetry item to process.</param>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.Dispose">
            <summary>
            Disposes the object.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor.Dispose(System.Boolean)">
            <summary>
            Disposes the object.
            </summary>
            <param name="disposing">True if disposing.</param>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.ApplicationFolderProvider.CheckAccessPermissions(System.IO.DirectoryInfo)">
            <summary>
            Throws <see cref="T:System.UnauthorizedAccessException" /> if the process lacks the required permissions to access the <paramref name="telemetryDirectory"/>.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.ApplicationStoppingEventArgs">
            <summary>
            Encapsulates arguments of the <see cref="E:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.IApplicationLifecycle.Stopping"/> event.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.ApplicationStoppingEventArgs.#ctor(System.Func{System.Func{System.Threading.Tasks.Task},System.Threading.Tasks.Task})">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.ApplicationStoppingEventArgs"/> class with the specified runner of asynchronous methods.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.ApplicationStoppingEventArgs.Run(System.Func{System.Threading.Tasks.Task})">
            <summary>
            Runs the specified asynchronous method while preventing the application from exiting.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.CurrentThreadTaskScheduler">
            <summary>
            Runs tasks synchronously, on the current thread. 
            From <a href="http://code.msdn.microsoft.com/Samples-for-Parallel-b4b76364/view/SourceCode"/>.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.ExceptionHandler.Start(System.Func{System.Threading.Tasks.Task})">
            <summary>
            Starts the <paramref name="asyncMethod"/>, catches and logs any exceptions it may throw.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.IApplicationFolderProvider.GetApplicationFolder">
            <summary>
            Returns a per-user/per-application folder.
            </summary>
            <returns>
            An <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.IPlatformFolder"/> instance, or <c>null</c> if current application does not have access to file system.
            </returns>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.IApplicationLifecycle">
            <summary>
            Encapsulates application lifecycle events.
            </summary>
        </member>
        <member name="E:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.IApplicationLifecycle.Started">
            <summary>
            Occurs when a new instance of the application is started or an existing instance is activated.
            </summary>
        </member>
        <member name="E:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.IApplicationLifecycle.Stopping">
            <summary>
            Occurs when the application is suspending or closing.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.INetwork">
            <summary>
            Encapsulates platform-specific behavior of network information APIs.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.INetwork.AddAddressChangedEventHandler(System.Net.NetworkInformation.NetworkAddressChangedEventHandler)">
            <summary>
            Adds <see cref="E:System.Net.NetworkInformation.NetworkChange.NetworkAddressChanged"/> event handler.
            </summary>
            <remarks>
            Defined as a method instead of an event in this interface because C# compiler 
            changes signature of event in a Windows Runtime component, making it very hard 
            to implement properly.
            </remarks>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.INetwork.RemoveAddressChangeEventHandler(System.Net.NetworkInformation.NetworkAddressChangedEventHandler)">
            <summary>
            Removes <see cref="E:System.Net.NetworkInformation.NetworkChange.NetworkAddressChanged"/> event handler.
            </summary>
            <param name="handler">Address changed event handler.</param>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.Network">
            <summary>
            Encapsulates platform-specific behavior of network information APIs.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.NetworkAvailabilityTransmissionPolicy.Dispose">
            <summary>
            Releases resources used by this <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.NetworkAvailabilityTransmissionPolicy"/> instance.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TelemetryBuffer">
            <summary>
            Accumulates <see cref="T:Microsoft.ApplicationInsights.Channel.ITelemetry"/> items for efficient transmission.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TelemetryBuffer.Capacity">
            <summary>
            Gets or sets the maximum number of telemetry items that can be buffered before transmission.
            </summary>
            <exception cref="T:System.ArgumentOutOfRangeException">The value is zero or less.</exception>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TelemetryBuffer.Dispose">
            <summary>
            Releases resources used by this <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TelemetryBuffer"/> instance.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TelemetryBuffer.Process(Microsoft.ApplicationInsights.Channel.ITelemetry)">
            <summary>
            Processes the specified <paramref name="item"/> item.
            </summary>
            <exception cref="T:System.ArgumentNullException">The <paramref name="item"/> is null.</exception>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TelemetryBuffer.FlushAsync">
            <summary>
            Passes all <see cref="T:Microsoft.ApplicationInsights.Channel.ITelemetry"/> items to the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TelemetrySerializer"/> and empties the queue.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TelemetrySerializer.EndpointAddress">
            <summary>
            Gets or sets the endpoint address.  
            </summary>
            <remarks>
            If endpoint address is set to null, the default endpoint address will be used. 
            </remarks>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionBuffer.Capacity">
            <summary>
            Gets or sets the maximum amount of memory in bytes for buffering <see cref="T:Microsoft.ApplicationInsights.Channel.Transmission"/> objects.
            </summary>
            <remarks>
            Use this property to limit the amount of memory used to store telemetry in memory of the 
            application before transmission. Once the maximum amount of memory is
            reached, <see cref="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionBuffer.Enqueue(System.Func{Microsoft.ApplicationInsights.Channel.Transmission})"/> will reject new transmissions.
            </remarks>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionBuffer.Size">
            <summary>
            Gets the combined length of <see cref="P:Microsoft.ApplicationInsights.Channel.Transmission.Content"/> stored in the buffer.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionExtensions.Load(System.IO.Stream)">
            <summary>
            Loads a new transmission from the specified <paramref name="stream"/>.
            </summary>
            <returns>Return transmission loaded from file; throws FormatException is file is corrupted.</returns>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionExtensions.Save(Microsoft.ApplicationInsights.Channel.Transmission,System.IO.Stream)">
            <summary>
            Saves the transmission to the specified <paramref name="stream"/>.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionSender.Capacity">
            <summary>
            Gets or sets the the maximum number of <see cref="T:Microsoft.ApplicationInsights.Channel.Transmission"/> objects that can be sent simultaneously.
            </summary>
            <remarks>
            Use this property to limit the number of concurrent HTTP connections. Once the maximum number of 
            transmissions in progress is reached, <see cref="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionSender.Enqueue(System.Func{Microsoft.ApplicationInsights.Channel.Transmission})"/> will stop accepting new transmissions
            until previous transmissions are sent.
            </remarks>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionStorage.Capacity">
            <summary>
            Gets or sets the total amount of disk space, in bytes, allowed for storing transmission files.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.Transmitter">
            <summary>
            Implements throttled and persisted transmission of telemetry to Application Insights. 
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.Transmitter.#ctor(Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionSender,Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionBuffer,Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionStorage,System.Collections.Generic.IEnumerable{Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.TransmissionPolicy})">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.Transmitter" /> class. Used only for UTs.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.Transmitter.Dispose">
            <summary>
            Releases resources used by this <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.Transmitter"/> instance.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle">
            <summary>
            Implements the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.IApplicationLifecycle"/> events for web applications.
            </summary>
        </member>
        <member name="E:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle.Started">
            <summary>
            The <see cref="E:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle.Started"/> event is raised when the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle"/> instance is first created.
            This event is not raised for web applications.
            </summary>
        </member>
        <member name="E:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle.Stopping">
            <summary>
            The <see cref="E:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle.Stopping"/> event is raised when <see cref="T:System.Web.Hosting.HostingEnvironment"/> calls the <see cref="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle.Stop(System.Boolean)"/> method.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle.Dispose">
            <summary>
            Unregisters the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle"/> from <see cref="T:System.Web.Hosting.HostingEnvironment"/>.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.Implementation.WebApplicationLifecycle.Stop(System.Boolean)">
            <summary>
            Gets called by <see cref="T:System.Web.Hosting.HostingEnvironment"/> when the web application is stopping.
            </summary>
            <param name="immediate">
            False when the method is invoked first time, allowing async shutdown operations.
            True when the method is invoked second time, demanding to unregister immediately.
            </param>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor">
            <summary>
            Represents a telemetry processor for sampling telemetry at a fixed-rate before sending to Application Insights.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor.#ctor(Microsoft.ApplicationInsights.Extensibility.ITelemetryProcessor)">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor"/> class.
            <param name="next">Next TelemetryProcessor in call chain.</param>
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor.SamplingPercentage">
            <summary>
            Gets or sets data sampling percentage (between 0 and 100) for all <see cref="T:Microsoft.ApplicationInsights.Channel.ITelemetry"/>
            objects logged in this <see cref="T:Microsoft.ApplicationInsights.TelemetryClient"/>.
            </summary>
            <remarks>
            All sampling percentage must be in a ratio of 100/N where N is a whole number (2, 3, 4, …). E.g. 50 for 1/2 or 33.33 for 1/3.
            Failure to follow this pattern can result in unexpected / incorrect computation of values in the portal.
            </remarks>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor.Next">
            <summary>
            Gets or sets the next TelemetryProcessor in call chain.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor.Process(Microsoft.ApplicationInsights.Channel.ITelemetry)">
            <summary>
            Process a collected telemetry item.
            </summary>
            <param name="item">A collected Telemetry item.</param>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel">
            <summary>
            Represents a communication channel for sending telemetry to Application Insights via HTTP/S.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.#ctor">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel"/> class.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.DeveloperMode">
            <summary>
            Gets or sets a value indicating whether developer mode of telemetry transmission is enabled.
            When developer mode is True, <see cref="N:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel"/> sends telemetry to Application Insights immediately 
            during the entire lifetime of the application. When developer mode is False, <see cref="N:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel"/>
            respects production sending policies defined by other properties.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.EndpointAddress">
            <summary>
            Gets or sets the HTTP address where the telemetry is sent.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.MaxTelemetryBufferDelay">
            <summary>
            Gets or sets the maximum telemetry batching interval. Once the interval expires, <see cref="N:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel"/> 
            serializes the accumulated telemetry items for transmission.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.MaxTelemetryBufferCapacity">
            <summary>
            Gets or sets the maximum number of telemetry items will accumulate in a memory before 
            the <see cref="N:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel"/> serializing them for transmission to Application Insights.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.MaxTransmissionBufferCapacity">
            <summary>
            Gets or sets the maximum amount of memory, in bytes, that <see cref="N:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel"/> will use 
            to buffer transmissions before sending them to Application Insights.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.MaxTransmissionSenderCapacity">
            <summary>
            Gets or sets the maximum number of telemetry transmissions that <see cref="N:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel"/> will 
            send to Application Insights at the same time.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.MaxTransmissionStorageCapacity">
            <summary>
            Gets or sets the maximum amount of disk space, in bytes, that <see cref="N:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel"/> will 
            use to store unsent telemetry transmissions.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.StorageFolder">
            <summary>
            Gets or sets the folder to be used as a temporary storage for events that were not sent because of temporary connectivity issues. 
            If folder was not provided or inaccessible. %LocalAppData% or %Temp% folder will be used.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.TelemetryProcessor">
            <summary>
            Gets or sets first TelemetryProcessor in processor call chain.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.Dispose">
            <summary>
            Releases unmanaged and - optionally - managed resources.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.Send(Microsoft.ApplicationInsights.Channel.ITelemetry)">
            <summary>
            Sends an instance of ITelemetry through the channel.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.Flush">
            <summary>
            Synchronously flushes the telemetry buffer. 
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel.Initialize(Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration)">
            <summary>
            Initialize method is called after all configuration properties have been loaded from the configuration.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter">
            <summary>
            Exponential moving average counter.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter.average">
            <summary>
            Average value of the counter.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter.current">
            <summary>
            Value of the counter during current interval of time.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter.#ctor(System.Double)">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter"/> class.
            </summary>
            <param name="coefficient">Exponential coefficient.</param>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter.Coefficient">
            <summary>
            Gets exponential coefficient (must be between 0 and 1).
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter.Average">
            <summary>
            Gets exponential moving average value of the counter.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter.Increment">
            <summary>
            Increments counter value.
            </summary>
            <returns>Incremented value.</returns>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.ExponentialMovingAverageCounter.StartNewInterval">
            <summary>
            Zeros out current value and starts new 'counter interval'.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.IRandomNumberBatchGenerator">
            <summary>
            Interface for random number generator capable of producing 
            a batch of unsigned 64 bit random numbers.
            </summary>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings">
            <summary>
            Container for all the settings applicable to the process of dynamically estimating 
            application telemetry sampling percentage.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.default">
            <summary>
            Set of default settings.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.#ctor">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings"/> class.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.MaxTelemetryItemsPerSecond">
            <summary>
            Gets or sets maximum rate of telemetry items per second
            dynamic sampling will try to adhere to.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.InitialSamplingPercentage">
            <summary>
            Gets or sets initial sampling percentage applied at the start
            of the process to dynamically vary the percentage.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.MinSamplingPercentage">
            <summary>
            Gets or sets minimum sampling percentage that can be set 
            by the dynamic sampling percentage algorithm.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.MaxSamplingPercentage">
            <summary>
            Gets or sets maximum sampling percentage that can be set 
            by the dynamic sampling percentage algorithm.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EvaluationInterval">
            <summary>
            Gets or sets duration of the sampling percentage evaluation 
            interval in seconds.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.SamplingPercentageDecreaseTimeout">
            <summary>
            Gets or sets a value indicating how long to not to decrease
            sampling percentage after last change to prevent excessive fluctuation.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.SamplingPercentageIncreaseTimeout">
            <summary>
            Gets or sets a value indicating how long to not to increase
            sampling percentage after last change to prevent excessive fluctuation.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.MovingAverageRatio">
            <summary>
            Gets or sets exponential moving average ratio (factor) applied
            during calculation of rate of telemetry items produced by the application.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EffectiveMaxTelemetryItemsPerSecond">
            <summary>
            Gets effective maximum telemetry items rate per second 
            adjusted in case user makes an error while setting a value.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EffectiveInitialSamplingRate">
            <summary>
            Gets effective initial sampling rate
            adjusted in case user makes an error while setting a value.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EffectiveMinSamplingRate">
            <summary>
            Gets effective minimum sampling rate
            adjusted in case user makes an error while setting a value.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EffectiveMaxSamplingRate">
            <summary>
            Gets effective maximum sampling rate
            adjusted in case user makes an error while setting a value.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EffectiveEvaluationInterval">
            <summary>
            Gets effective sampling percentage evaluation interval
            adjusted in case user makes an error while setting a value.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EffectiveSamplingPercentageDecreaseTimeout">
            <summary>
            Gets effective sampling percentage decrease timeout
            adjusted in case user makes an error while setting a value.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EffectiveSamplingPercentageIncreaseTimeout">
            <summary>
            Gets effective sampling percentage increase timeout
            adjusted in case user makes an error while setting a value.
            </summary>
        </member>
        <member name="P:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.EffectiveMovingAverageRatio">
            <summary>
            Gets effective exponential moving average ratio
            adjusted in case user makes an error while setting a value.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings.AdjustSamplingPercentage(System.Double)">
            <summary>
            Adjusts sampling percentage set by user to account for errors
            such as setting it below zero or above 100%.
            </summary>
            <param name="samplingPercentage">Input sampling percentage.</param>
            <returns>Adjusted sampling percentage in range &gt; 0 and &lt;= 100.</returns>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.AdaptiveSamplingPercentageEvaluatedCallback">
            <summary>
            Represents a method that is invoked every time sampling percentage is evaluated
            by the dynamic sampling algorithm.
            </summary>
            <param name="afterSamplingTelemetryItemRatePerSecond">Rate of telemetry items generated by this instance of the application after current sampling percentage was applied.</param>
            <param name="currentSamplingPercentage">Current sampling percentage that was used by the algorithm.</param>
            <param name="newSamplingPercentage">Suggested new sampling percentage that will allow to keep desired telemetry item generation rate given the volume of items states the same.</param>
            <param name="isSamplingPercentageChanged">A value indicating whether new sampling percentage will be applied by dynamic sampling algorithm. New sampling percentage may not be immediately applied in case it was recently changed.</param>
            <param name="settings">Dynamic sampling algorithm settings.</param>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor">
            <summary>
            Telemetry processor to estimate ideal sampling percentage.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.next">
            <summary>
            Next-in-chain processor.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.settings">
            <summary>
            Dynamic sampling estimator settings.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.itemCount">
            <summary>
            Average telemetry item counter.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.evaluationTimer">
            <summary>
            Evaluation timer.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.evaluationInterval">
            <summary>
            Current evaluation interval.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.currenSamplingRate">
            <summary>
            Current sampling rate.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.samplingPercentageLastChangeDateTime">
            <summary>
            Last date and time sampling percentage was changed.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.evaluationCallback">
            <summary>
            Callback to invoke every time sampling percentage is evaluated.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.#ctor(Microsoft.ApplicationInsights.Extensibility.ITelemetryProcessor)">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor"/> class.
            <param name="next">Next TelemetryProcessor in call chain.</param>
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.#ctor(Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings,Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.AdaptiveSamplingPercentageEvaluatedCallback,Microsoft.ApplicationInsights.Extensibility.ITelemetryProcessor)">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor"/> class.
            <param name="settings">Dynamic sampling estimator settings.</param>
            <param name="callback">Callback to invoke every time sampling percentage is evaluated.</param>
            <param name="next">Next TelemetryProcessor in call chain.</param>
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.Process(Microsoft.ApplicationInsights.Channel.ITelemetry)">
            <summary>
            Processes telemetry item.
            </summary>
            <param name="item">Telemetry item to process.</param>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.Dispose">
            <summary>
            Disposes the object.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.MovingAverageCoefficientChanged(System.Double,System.Double)">
            <summary>
            Checks to see if exponential moving average has changed.
            </summary>
            <param name="running">Currently running value of moving average.</param>
            <param name="current">Value set in the algorithm parameters.</param>
            <returns>True if moving average value changed.</returns>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorTelemetryProcessor.EstimateSamplingPercentage(System.Object)">
            <summary>
            Callback for sampling percentage evaluation timer.
            </summary>
            <param name="state">Timer state.</param>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingScoreGenerator">
            <summary>
            Utility class for sampling score generation.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingScoreGenerator.GetSamplingScore(Microsoft.ApplicationInsights.Channel.ITelemetry)">
            <summary>
            Generates telemetry sampling score between 0 and 100.
            </summary>
            <param name="telemetry">Telemetry item to score.</param>
            <returns>Item sampling score.</returns>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.random">
            <summary>
            Generator singleton.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.index">
            <summary>
            Index of the last used random number within pre-generated array.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.segmentCount">
            <summary>
            Count of segments of random numbers.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.segmentSize">
            <summary>
            Number of random numbers per segment.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.bitsToStoreRandomIndexWithinSegment">
            <summary>
            Number of bits used to store index of the random number within segment.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.segmentIndexMask">
            <summary>
            Bit mask to get segment index bits.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.randomIndexWithinSegmentMask">
            <summary>
            Bit mask to get index of the random number within segment.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.randomArrayIndexMask">
            <summary>
            Bit mask to get index of the random number in the pre-generated array.
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.randomGemerators">
            <summary>
            Array of random number batch generators (one per each segment).
            </summary>
        </member>
        <member name="F:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.randomNumbers">
            <summary>
            Array of pre-generated random numbers.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.#ctor">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom"/> class.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.Initialize">
            <summary>
            Initializes generator with a set of random numbers.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.Initialize(System.Func{System.UInt64,Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.IRandomNumberBatchGenerator},System.Int32,System.Int32)">
            <summary>
            Initializes generator with a set of random numbers.
            </summary>
            <param name="randomGeneratorFactory">Factory used to create random number batch generators.</param>
            <param name="segmentIndexBits">Number of significant bits in segment index, i.e. value of 3 means 8 segments of random numbers - 0..7.</param>
            <param name="segmentBits">Number of significant bits in random number index within segment, i.e. value of 10 means 1024 random numbers per segment.</param>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.Next">
            <summary>
            Weakly thread safe next (random) operation id generator
            where 'weakly' indicates that it is unlikely we'll get into 
            collision state.
            </summary>
            <returns>Next operation id.</returns>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.WeakConcurrentRandom.RegenerateSegment(System.Int32)">
            <summary>
            Generates random number batch for segment which just exhausted
            according to value of the new index.
            </summary>
            <param name="newIndex">Index in random number array of the random number we're about to return.</param>
        </member>
        <member name="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.XorshiftRandomBatchGenerator">
            <summary>
            Generates batches of random number using Xorshift algorithm
            Note: the base code is from http://www.codeproject.com/Articles/9187/A-fast-equivalent-for-System-Random.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.XorshiftRandomBatchGenerator.#ctor(System.UInt64)">
            <summary>
            Initializes a new instance of the <see cref="T:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.XorshiftRandomBatchGenerator"/> class.
            </summary>
            <param name="seed">Random generator seed value.</param>
        </member>
        <member name="M:Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.XorshiftRandomBatchGenerator.NextBatch(System.UInt64[],System.Int32,System.Int32)">
            <summary>
            Generates a batch of random numbers.
            </summary>
            <param name="buffer">Buffer to put numbers in.</param>
            <param name="index">Start index in the buffer.</param>
            <param name="count">Count of random numbers to generate.</param>
        </member>
        <member name="T:Microsoft.ApplicationInsights.Extensibility.TelemetryProcessorChainBuilderExtensions">
            <summary>
            Extension methods for <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/>.
            Adds shorthand for adding well-known processors.
            </summary>
        </member>
        <member name="M:Microsoft.ApplicationInsights.Extensibility.TelemetryProcessorChainBuilderExtensions.UseSampling(Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder,System.Double)">
            <summary>
            Adds <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.SamplingTelemetryProcessor"/> to the given<see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder" />
            </summary>
            <param name="builder">Instance of <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/></param>
            <param name="samplingPercentage">Sampling Percentage to configure.</param>        
            <return>Instance of <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/>.</return>
        </member>
        <member name="M:Microsoft.ApplicationInsights.Extensibility.TelemetryProcessorChainBuilderExtensions.UseAdaptiveSampling(Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder)">
            <summary>
            Adds <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor"/> to the <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder" />
            </summary>
            <param name="builder">Instance of <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/></param>
            <return>Instance of <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/>.</return>
        </member>
        <member name="M:Microsoft.ApplicationInsights.Extensibility.TelemetryProcessorChainBuilderExtensions.UseAdaptiveSampling(Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder,System.Double)">
            <summary>
            Adds <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor"/> to the <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder" />
            </summary>
            <param name="builder">Instance of <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/></param>
            <param name="maxTelemetryItemsPerSecond">Maximum number of telemetry items to be generated on this application instance.</param>
            <return>Instance of <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/>.</return>
        </member>
        <member name="M:Microsoft.ApplicationInsights.Extensibility.TelemetryProcessorChainBuilderExtensions.UseAdaptiveSampling(Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder,Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.SamplingPercentageEstimatorSettings,Microsoft.ApplicationInsights.WindowsServer.Channel.Implementation.AdaptiveSamplingPercentageEvaluatedCallback)">
            <summary>
            Adds <see cref="T:Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.AdaptiveSamplingTelemetryProcessor"/> to the <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder" />
            </summary>
            <param name="builder">Instance of <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/></param>
            <param name="settings">Set of settings applicable to dynamic sampling percentage algorithm.</param>
            <param name="callback">Callback invoked every time sampling percentage evaluation occurs.</param>
            <return>Instance of <see cref="T:Microsoft.ApplicationInsights.Extensibility.Implementation.TelemetryProcessorChainBuilder"/>.</return>
        </member>
    </members>
</doc>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               <?xml version="1.0"?>
<doc>
    <assembly>
        <name>Microsoft.Owin.Security.Facebook</name>
    </assembly>
    <members>
        <member name="T:Owin.FacebookAuthenticationExtensions">
            <summary>
            Extension methods for using <see cref="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationMiddleware"/>
            </summary>
        </member>
        <member name="M:Owin.FacebookAuthenticationExtensions.UseFacebookAuthentication(Owin.IAppBuilder,Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions)">
            <summary>
            Authenticate users using Facebook
            </summary>
            <param name="app">The <see cref="T:Owin.IAppBuilder"/> passed to the configuration method</param>
            <param name="options">Middleware configuration options</param>
            <returns>The updated <see cref="T:Owin.IAppBuilder"/></returns>
        </member>
        <member name="M:Owin.FacebookAuthenticationExtensions.UseFacebookAuthentication(Owin.IAppBuilder,System.String,System.String)">
            <summary>
            Authenticate users using Facebook
            </summary>
            <param name="app">The <see cref="T:Owin.IAppBuilder"/> passed to the configuration method</param>
            <param name="appId">The appId assigned by Facebook</param>
            <param name="appSecret">The appSecret assigned by Facebook</param>
            <returns>The updated <see cref="T:Owin.IAppBuilder"/></returns>
        </member>
        <member name="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationMiddleware">
            <summary>
            OWIN middleware for authenticating users using Facebook
            </summary>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookAuthenticationMiddleware.#ctor(Microsoft.Owin.OwinMiddleware,Owin.IAppBuilder,Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions)">
            <summary>
            Initializes a <see cref="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationMiddleware"/>
            </summary>
            <param name="next">The next middleware in the OWIN pipeline to invoke</param>
            <param name="app">The OWIN application</param>
            <param name="options">Configuration options for the middleware</param>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookAuthenticationMiddleware.CreateHandler">
            <summary>
            Provides the <see cref="T:Microsoft.Owin.Security.Infrastructure.AuthenticationHandler"/> object for processing authentication-related requests.
            </summary>
            <returns>An <see cref="T:Microsoft.Owin.Security.Infrastructure.AuthenticationHandler"/> configured with the <see cref="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions"/> supplied to the constructor.</returns>
        </member>
        <member name="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions">
            <summary>
            Configuration options for <see cref="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationMiddleware"/>
            </summary>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.#ctor">
            <summary>
            Initializes a new <see cref="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions"/>
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.AppId">
            <summary>
            Gets or sets the Facebook-assigned appId
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.AppSecret">
            <summary>
            Gets or sets the Facebook-assigned app secret
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.AuthorizationEndpoint">
            <summary>
            Gets or sets the URI where the client will be redirected to authenticate.
            The default value is 'https://www.facebook.com/dialog/oauth'.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.TokenEndpoint">
            <summary>
            Gets or sets the URI the middleware will access to exchange the OAuth token.
            The default value is 'https://graph.facebook.com/oauth/access_token'.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.UserInformationEndpoint">
            <summary>
            Gets or sets the URI the middleware will access to obtain the user information.
            The default value is 'https://graph.facebook.com/me'.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.BackchannelCertificateValidator">
            <summary>
            Gets or sets the a pinned certificate validator to use to validate the endpoints used
            in back channel communications belong to Facebook.
            </summary>
            <value>
            The pinned certificate validator.
            </value>
            <remarks>If this property is null then the default certificate checks are performed,
            validating the subject name and if the signing chain is a trusted party.</remarks>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.BackchannelTimeout">
            <summary>
            Gets or sets timeout value in milliseconds for back channel communications with Facebook.
            </summary>
            <value>
            The back channel timeout in milliseconds.
            </value>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.BackchannelHttpHandler">
            <summary>
            The HttpMessageHandler used to communicate with Facebook.
            This cannot be set at the same time as BackchannelCertificateValidator unless the value 
            can be downcast to a WebRequestHandler.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.Caption">
            <summary>
            Get or sets the text that the user can display on a sign in user interface.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.CallbackPath">
            <summary>
            The request path within the application's base path where the user-agent will be returned.
            The middleware will process this request when it arrives.
            Default value is "/signin-facebook".
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.SignInAsAuthenticationType">
            <summary>
            Gets or sets the name of another authentication middleware which will be responsible for actually issuing a user <see cref="T:System.Security.Claims.ClaimsIdentity"/>.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.Provider">
            <summary>
            Gets or sets the <see cref="T:Microsoft.Owin.Security.Facebook.IFacebookAuthenticationProvider"/> used to handle authentication events.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.StateDataFormat">
            <summary>
            Gets or sets the type used to secure data handled by the middleware.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.Scope">
            <summary>
            A list of permissions to request.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions.SendAppSecretProof">
            <summary>
            Gets or sets if the appsecret_proof should be generated and sent with Facebook API calls.
            This is enabled by default.
            </summary>
        </member>
        <member name="T:Microsoft.Owin.Security.Facebook.FacebookApplyRedirectContext">
            <summary>
            Context passed when a Challenge causes a redirect to authorize endpoint in the Facebook middleware
            </summary>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookApplyRedirectContext.#ctor(Microsoft.Owin.IOwinContext,Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions,Microsoft.Owin.Security.AuthenticationProperties,System.String)">
            <summary>
            Creates a new context object.
            </summary>
            <param name="context">The OWIN request context</param>
            <param name="options">The Facebook middleware options</param>
            <param name="properties">The authenticaiton properties of the challenge</param>
            <param name="redirectUri">The initial redirect URI</param>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookApplyRedirectContext.RedirectUri">
            <summary>
            Gets the URI used for the redirect operation.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookApplyRedirectContext.Properties">
            <summary>
            Gets the authentication properties of the challenge
            </summary>
        </member>
        <member name="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext">
            <summary>
            Contains information about the login session as well as the user <see cref="T:System.Security.Claims.ClaimsIdentity"/>.
            </summary>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.#ctor(Microsoft.Owin.IOwinContext,Newtonsoft.Json.Linq.JObject,System.String,System.String)">
            <summary>
            Initializes a <see cref="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext"/>
            </summary>
            <param name="context">The OWIN environment</param>
            <param name="user">The JSON-serialized user</param>
            <param name="accessToken">Facebook Access token</param>
            <param name="expires">Seconds until expiration</param>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.User">
            <summary>
            Gets the JSON-serialized user
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.AccessToken">
            <summary>
            Gets the Facebook access token
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.ExpiresIn">
            <summary>
            Gets the Facebook access token expiration time
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.Id">
            <summary>
            Gets the Facebook user ID
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.Name">
            <summary>
            Gets the user's name
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.UserName">
            <summary>
            Gets the Facebook username
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.Email">
            <summary>
            Gets the Facebook email
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.Identity">
            <summary>
            Gets the <see cref="T:System.Security.Claims.ClaimsIdentity"/> representing the user
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext.Properties">
            <summary>
            Gets or sets a property bag for common authentication properties
            </summary>
        </member>
        <member name="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider">
            <summary>
            Default <see cref="T:Microsoft.Owin.Security.Facebook.IFacebookAuthenticationProvider"/> implementation.
            </summary>
        </member>
        <member name="T:Microsoft.Owin.Security.Facebook.IFacebookAuthenticationProvider">
            <summary>
            Specifies callback methods which the <see cref="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationMiddleware"></see> invokes to enable developer control over the authentication process. /&gt;
            </summary>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.IFacebookAuthenticationProvider.Authenticated(Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext)">
            <summary>
            Invoked whenever Facebook succesfully authenticates a user
            </summary>
            <param name="context">Contains information about the login session as well as the user <see cref="T:System.Security.Claims.ClaimsIdentity"/>.</param>
            <returns>A <see cref="T:System.Threading.Tasks.Task"/> representing the completed operation.</returns>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.IFacebookAuthenticationProvider.ReturnEndpoint(Microsoft.Owin.Security.Facebook.FacebookReturnEndpointContext)">
            <summary>
            Invoked prior to the <see cref="T:System.Security.Claims.ClaimsIdentity"/> being saved in a local cookie and the browser being redirected to the originally requested URL.
            </summary>
            <param name="context"></param>
            <returns>A <see cref="T:System.Threading.Tasks.Task"/> representing the completed operation.</returns>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.IFacebookAuthenticationProvider.ApplyRedirect(Microsoft.Owin.Security.Facebook.FacebookApplyRedirectContext)">
            <summary>
            Called when a Challenge causes a redirect to authorize endpoint in the Facebook middleware
            </summary>
            <param name="context">Contains redirect URI and <see cref="T:Microsoft.Owin.Security.AuthenticationProperties"/> of the challenge </param>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider.#ctor">
            <summary>
            Initializes a <see cref="T:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider"/>
            </summary>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider.Authenticated(Microsoft.Owin.Security.Facebook.FacebookAuthenticatedContext)">
            <summary>
            Invoked whenever Facebook succesfully authenticates a user
            </summary>
            <param name="context">Contains information about the login session as well as the user <see cref="T:System.Security.Claims.ClaimsIdentity"/>.</param>
            <returns>A <see cref="T:System.Threading.Tasks.Task"/> representing the completed operation.</returns>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider.ReturnEndpoint(Microsoft.Owin.Security.Facebook.FacebookReturnEndpointContext)">
            <summary>
            Invoked prior to the <see cref="T:System.Security.Claims.ClaimsIdentity"/> being saved in a local cookie and the browser being redirected to the originally requested URL.
            </summary>
            <param name="context"></param>
            <returns>A <see cref="T:System.Threading.Tasks.Task"/> representing the completed operation.</returns>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider.ApplyRedirect(Microsoft.Owin.Security.Facebook.FacebookApplyRedirectContext)">
            <summary>
            Called when a Challenge causes a redirect to authorize endpoint in the Facebook middleware
            </summary>
            <param name="context">Contains redirect URI and <see cref="T:Microsoft.Owin.Security.AuthenticationProperties"/> of the challenge </param>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider.OnAuthenticated">
            <summary>
            Gets or sets the function that is invoked when the Authenticated method is invoked.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider.OnReturnEndpoint">
            <summary>
            Gets or sets the function that is invoked when the ReturnEndpoint method is invoked.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider.OnApplyRedirect">
            <summary>
            Gets or sets the delegate that is invoked when the ApplyRedirect method is invoked.
            </summary>
        </member>
        <member name="T:Microsoft.Owin.Security.Facebook.FacebookReturnEndpointContext">
            <summary>
            Provides context information to middleware providers.
            </summary>
        </member>
        <member name="M:Microsoft.Owin.Security.Facebook.FacebookReturnEndpointContext.#ctor(Microsoft.Owin.IOwinContext,Microsoft.Owin.Security.AuthenticationTicket)">
            <summary>
            
            </summary>
            <param name="context">OWIN environment</param>
            <param name="ticket">The authentication ticket</param>
        </member>
        <member name="T:Microsoft.Owin.Security.Facebook.Resources">
            <summary>
              A strongly-typed resource class, for looking up localized strings, etc.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.Resources.ResourceManager">
            <summary>
              Returns the cached ResourceManager instance used by this class.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.Resources.Culture">
            <summary>
              Overrides the current thread's CurrentUICulture property for all
              resource lookups using this strongly typed resource class.
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.Resources.Exception_OptionMustBeProvided">
            <summary>
              Looks up a localized string similar to The &apos;{0}&apos; option must be provided..
            </summary>
        </member>
        <member name="P:Microsoft.Owin.Security.Facebook.Resources.Exception_ValidatorHandlerMismatch">
            <summary>
              Looks up a localized string similar to An ICertificateValidator cannot be specified at the same time as an HttpMessageHandler unless it is a WebRequestHandler..
            </summary>
        </member>
    </members>
</doc>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             zePersistentResponse(minData);
                            }

                            transportLogic.processMessages(instance, minData, fireConnect);

                            if (data &&
                                $.type(data.LongPollDelay) === "number") {
                                delay = data.LongPollDelay;
                            }

                            if (data && data.Disconnect) {
                                return;
                            }

                            if (isDisconnecting(instance) === true) {
                                return;
                            }

                            shouldReconnect = data && data.ShouldReconnect;
                            if (shouldReconnect) {
                                // Transition into the reconnecting state
                                // If this fails then that means that the user transitioned the connection into a invalid state in processMessages.
                                if (!transportLogic.ensureReconnectingState(instance)) {
                                    return;
                                }
                            }

                            // We never want to pass a raiseReconnect flag after a successful poll.  This is handled via the error function
                            if (delay > 0) {
                                privateData.pollTimeoutId = window.setTimeout(function () {
                                    poll(instance, shouldReconnect);
                                }, delay);
                            } else {
                                poll(instance, shouldReconnect);
                            }
                        },

                        error: function (data, textStatus) {
                            // Stop trying to trigger reconnect, connection is in an error state
                            // If we're not in the reconnect state this will noop
                            window.clearTimeout(privateData.reconnectTimeoutId);
                            privateData.reconnectTimeoutId = null;

                            if (textStatus === "abort") {
                                connection.log("Aborted xhr request.");
                                return;
                            }

                            if (!tryFailConnect()) {

                                // Increment our reconnect errors, we assume all errors to be reconnect errors
                                // In the case that it's our first error this will cause Reconnect to be fired
                                // after 1 second due to reconnectErrors being = 1.
                                reconnectErrors++;

                                if (connection.state !== signalR.connectionState.reconnecting) {
                                    connection.log("An error occurred using longPolling. Status = " + textStatus + ".  Response = " + data.responseText + ".");
                                    $(instance).triggerHandler(events.onError, [signalR._.transportError(signalR.resources.longPollFailed, connection.transport, data, instance.pollXhr)]);
                                }

                                // We check the state here to verify that we're not in an invalid state prior to verifying Reconnect.
                                // If we're not in connected or reconnecting then the next ensureReconnectingState check will fail and will return.
                                // Therefore we don't want to change that failure code path.
                                if ((connection.state === signalR.connectionState.connected ||
                                    connection.state === signalR.connectionState.reconnecting) &&
                                    !transportLogic.verifyLastActive(connection)) {
                                    return;
                                }

                                // Transition into the reconnecting state
                                // If this fails then that means that the user transitioned the connection into the disconnected or connecting state within the above error handler trigger.
                                if (!transportLogic.ensureReconnectingState(instance)) {
                                    return;
                                }

                                // Call poll with the raiseReconnect flag as true after the reconnect delay
                                privateData.pollTimeoutId = window.setTimeout(function () {
                                    poll(instance, true);
                                }, that.reconnectDelay);
                            }
                        }
                    });

                    // This will only ever pass after an error has occured via the poll ajax procedure.
                    if (reconnecting && raiseReconnect === true) {
                        // We wait to reconnect depending on how many times we've failed to reconnect.
                        // This is essentially a heuristic that will exponentially increase in wait time before
                        // triggering reconnected.  This depends on the "error" handler of Poll to cancel this 
                        // timeout if it triggers before the Reconnected event fires.
                        // The Math.min at the end is to ensure that the reconnect timeout does not overflow.
                        privateData.reconnectTimeoutId = window.setTimeout(function () { fireReconnected(instance); }, Math.min(1000 * (Math.pow(2, reconnectErrors) - 1), maxFireReconnectedTimeout));
                    }
                }(connection));
            }, 250); // Have to delay initial poll so Chrome doesn't show loader spinner in tab
        },

        lostConnection: function (connection) {
            if (connection.pollXhr) {
                connection.pollXhr.abort("lostConnection");
            }
        },

        send: function (connection, data) {
            transportLogic.ajaxSend(connection, data);
        },

        stop: function (connection) {
            /// <summary>Stops the long polling connection</summary>
            /// <param name="connection" type="signalR">The SignalR connection to stop</param>

            window.clearTimeout(connection._.pollTimeoutId);
            window.clearTimeout(connection._.reconnectTimeoutId);

            delete connection._.pollTimeoutId;
            delete connection._.reconnectTimeoutId;

            if (connection.pollXhr) {
                connection.pollXhr.abort();
                connection.pollXhr = null;
                delete connection.pollXhr;
            }
        },

        abort: function (connection, async) {
            transportLogic.ajaxAbort(connection, async);
        }
    };

}(window.jQuery, window));
/* jquery.signalR.hubs.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.core.js" />

(function ($, window, undefined) {

    var eventNamespace = ".hubProxy",
        signalR = $.signalR;

    function makeEventName(event) {
        return event + eventNamespace;
    }

    // Equivalent to Array.prototype.map
    function map(arr, fun, thisp) {
        var i,
            length = arr.length,
            result = [];
        for (i = 0; i < length; i += 1) {
            if (arr.hasOwnProperty(i)) {
                result[i] = fun.call(thisp, arr[i], i, arr);
            }
        }
        return result;
    }

    function getArgValue(a) {
        return $.isFunction(a) ? null : ($.type(a) === "undefined" ? null : a);
    }

    function hasMembers(obj) {
        for (var key in obj) {
            // If we have any properties in our callback map then we have callbacks and can exit the loop via return
            if (obj.hasOwnProperty(key)) {
                return true;
            }
        }

        return false;
    }

    function clearInvocationCallbacks(connection, error) {
        /// <param name="connection" type="hubConnection" />
        var callbacks = connection._.invocationCallbacks,
            callback;

        if (hasMembers(callbacks)) {
            connection.log("Clearing hub invocation callbacks with error: " + error + ".");
        }

        // Reset the callback cache now as we have a local var referencing it
        connection._.invocationCallbackId = 0;
        delete connection._.invocationCallbacks;
        connection._.invocationCallbacks = {};

        // Loop over the callbacks and invoke them.
        // We do this using a local var reference and *after* we've cleared the cache
        // so that if a fail callback itself tries to invoke another method we don't 
        // end up with its callback in the list we're looping over.
        for (var callbackId in callbacks) {
            callback = callbacks[callbackId];
            callback.method.call(callback.scope, { E: error });
        }
    }

    // hubProxy
    function hubProxy(hubConnection, hubName) {
        /// <summary>
        ///     Creates a new proxy object for the given hub connection that can be used to invoke
        ///     methods on server hubs and handle client method invocation requests from the server.
        /// </summary>
        return new hubProxy.fn.init(hubConnection, hubName);
    }

    hubProxy.fn = hubProxy.prototype = {
        init: function (connection, hubName) {
            this.state = {};
            this.connection = connection;
            this.hubName = hubName;
            this._ = {
                callbackMap: {}
            };
        },

        constructor: hubProxy,

        hasSubscriptions: function () {
            return hasMembers(this._.callbackMap);
        },

        on: function (eventName, callback) {
            /// <summary>Wires up a callback to be invoked when a invocation request is received from the server hub.</summary>
            /// <param name="eventName" type="String">The name of the hub event to register the callback for.</param>
            /// <param name="callback" type="Function">The callback to be invoked.</param>
            var that = this,
                callbackMap = that._.callbackMap;

            // Normalize the event name to lowercase
            eventName = eventName.toLowerCase();

            // If there is not an event registered for this callback yet we want to create its event space in the callback map.
            if (!callbackMap[eventName]) {
                callbackMap[eventName] = {};
            }

            // Map the callback to our encompassed function
            callbackMap[eventName][callback] = function (e, data) {
                callback.apply(that, data);
            };

            $(that).bind(makeEventName(eventName), callbackMap[eventName][callback]);

            return that;
        },

        off: function (eventName, callback) {
            /// <summary>Removes the callback invocation request from the server hub for the given event name.</summary>
            /// <param name="eventName" type="String">The name of the hub event to unregister the callback for.</param>
            /// <param name="callback" type="Function">The callback to be invoked.</param>
            var that = this,
                callbackMap = that._.callbackMap,
                callbackSpace;

            // Normalize the event name to lowercase
            eventName = eventName.toLowerCase();

            callbackSpace = callbackMap[eventName];

            // Verify that there is an event space to unbind
            if (callbackSpace) {
                // Only unbind if there's an event bound with eventName and a callback with the specified callback
                if (callbackSpace[callback]) {
                    $(that).unbind(makeEventName(eventName), callbackSpace[callback]);

                    // Remove the callback from the callback map
                    delete callbackSpace[callback];

                    // Check if there are any members left on the event, if not we need to destroy it.
                    if (!hasMembers(callbackSpace)) {
                        delete callbackMap[eventName];
                    }
                } else if (!callback) { // Check if we're removing the whole event and we didn't error because of an invalid callback
                    $(that).unbind(makeEventName(eventName));

                    delete callbackMap[eventName];
                }
            }

            return that;
        },

        invoke: function (methodName) {
            /// <summary>Invokes a server hub method with the given arguments.</summary>
            /// <param name="methodName" type="String">The name of the server hub method.</param>

            var that = this,
                connection = that.connection,
                args = $.makeArray(arguments).slice(1),
                argValues = map(args, getArgValue),
                data = { H: that.hubName, M: methodName, A: argValues, I: connection._.invocationCallbackId },
                d = $.Deferred(),
                callback = function (minResult) {
                    var result = that._maximizeHubResponse(minResult),
                        source,
                        error;

                    // Update the hub state
                    $.extend(that.state, result.State);

                    if (result.Progress) {
                        if (d.notifyWith) {
                            // Progress is only supported in jQuery 1.7+
                            d.notifyWith(that, [result.Progress.Data]);
                        } else if(!connection._.progressjQueryVersionLogged) {
                            connection.log("A hub method invocation progress update was received but the version of jQuery in use (" + $.prototype.jquery + ") does not support progress updates. Upgrade to jQuery 1.7+ to receive progress notifications.");
                            connection._.progressjQueryVersionLogged = true;
                        }
                    } else if (result.Error) {
                        // Server hub method threw an exception, log it & reject the deferred
                        if (result.StackTrace) {
                            connection.log(result.Error + "\n" + result.StackTrace + ".");
                        }

                        // result.ErrorData is only set if a HubException was thrown
                        source = result.IsHubException ? "HubException" : "Exception";
                        error = signalR._.error(result.Error, source);
                        error.data = result.ErrorData;

                        connection.log(that.hubName + "." + methodName + " failed to execute. Error: " + error.message);
                        d.rejectWith(that, [error]);
                    } else {
                        // Server invocation succeeded, resolve the deferred
                        connection.log("Invoked " + that.hubName + "." + methodName);
                        d.resolveWith(that, [result.Result]);
                    }
                };

            connection._.invocationCallbacks[connection._.invocationCallbackId.toString()] = { scope: that, method: callback };
            connection._.invocationCallbackId += 1;

            if (!$.isEmptyObject(that.state)) {
                data.S = that.state;
            }

            connection.log("Invoking " + that.hubName + "." + methodName);
            connection.send(data);

            return d.promise();
        },

        _maximizeHubResponse: function (minHubResponse) {
            return {
                State: minHubResponse.S,
                Result: minHubResponse.R,
                Progress: minHubResponse.P ? {
                    Id: minHubResponse.P.I,
                    Data: minHubResponse.P.D
                } : null,
                Id: minHubResponse.I,
                IsHubException: minHubResponse.H,
                Error: minHubResponse.E,
                StackTrace: minHubResponse.T,
                ErrorData: minHubResponse.D
            };
        }
    };

    hubProxy.fn.init.prototype = hubProxy.fn;

    // hubConnection
    function hubConnection(url, options) {
        /// <summary>Creates a new hub connection.</summary>
        /// <param name="url" type="String">[Optional] The hub route url, defaults to "/signalr".</param>
        /// <param name="options" type="Object">[Optional] Settings to use when creating the hubConnection.</param>
        var settings = {
            qs: null,
            logging: false,
            useDefaultPath: true
        };

        $.extend(settings, options);

        if (!url || settings.useDefaultPath) {
            url = (url || "") + "/signalr";
        }
        return new hubConnection.fn.init(url, settings);
    }

    hubConnection.fn = hubConnection.prototype = $.connection();

    hubConnection.fn.init = function (url, options) {
        var settings = {
                qs: null,
                logging: false,
                useDefaultPath: true
            },
            connection = this;

        $.extend(settings, options);

        // Call the base constructor
        $.signalR.fn.init.call(connection, url, settings.qs, settings.logging);

        // Object to store hub proxies for this connection
        connection.proxies = {};

        connection._.invocationCallbackId = 0;
        connection._.invocationCallbacks = {};

        // Wire up the received handler
        connection.received(function (minData) {
            var data, proxy, dataCallbackId, callback, hubName, eventName;
            if (!minData) {
                return;
            }

            // We have to handle progress updates first in order to ensure old clients that receive
            // progress updates enter the return value branch and then no-op when they can't find
            // the callback in the map (because the minData.I value will not be a valid callback ID)
            if (typeof (minData.P) !== "undefined") {
                // Process progress notification
                dataCallbackId = minData.P.I.toString();
                callback = connection._.invocationCallbacks[dataCallbackId];
                if (callback) {
                    callback.method.call(callback.scope, minData);
                }
            } else if (typeof (minData.I) !== "undefined") {
                // We received the return value from a server method invocation, look up callback by id and call it
                dataCallbackId = minData.I.toString();
                callback = connection._.invocationCallbacks[dataCallbackId];
                if (callback) {
                    // Delete the callback from the proxy
                    connection._.invocationCallbacks[dataCallbackId] = null;
                    delete connection._.invocationCallbacks[dataCallbackId];

                    // Invoke the callback
                    callback.method.call(callback.scope, minData);
                }
            } else {
                data = this._maximizeClientHubInvocation(minData);

                // We received a client invocation request, i.e. broadcast from server hub
                connection.log("Triggering client hub event '" + data.Method + "' on hub '" + data.Hub + "'.");

                // Normalize the names to lowercase
                hubName = data.Hub.toLowerCase();
                eventName = data.Method.toLowerCase();

                // Trigger the local invocation event
                proxy = this.proxies[hubName];

                // Update the hub state
                $.extend(proxy.state, data.State);
                $(proxy).triggerHandler(makeEventName(eventName), [data.Args]);
            }
        });

        connection.error(function (errData, origData) {
            var callbackId, callback;

            if (!origData) {
                // No original data passed so this is not a send error
                return;
            }

            callbackId = origData.I;
            callback = connection._.invocationCallbacks[callbackId];

            // Verify that there is a callback bound (could have been cleared)
            if (callback) {
                // Delete the callback
                connection._.invocationCallbacks[callbackId] = null;
                delete connection._.invocationCallbacks[callbackId];

                // Invoke the callback with an error to reject the promise
                callback.method.call(callback.scope, { E: errData });
            }
        });

        connection.reconnecting(function () {
            if (connection.transport && connection.transport.name === "webSockets") {
                clearInvocationCallbacks(connection, "Connection started reconnecting before invocation result was received.");
            }
        });

        connection.disconnected(function () {
            clearInvocationCallbacks(connection, "Connection was disconnected before invocation result was received.");
        });
    };

    hubConnection.fn._maximizeClientHubInvocation = function (minClientHubInvocation) {
        return {
            Hub: minClientHubInvocation.H,
            Method: minClientHubInvocation.M,
            Args: minClientHubInvocation.A,
            State: minClientHubInvocation.S
        };
    };

    hubConnection.fn._registerSubscribedHubs = function () {
        /// <summary>
        ///     Sets the starting event to loop through the known hubs and register any new hubs 
        ///     that have been added to the proxy.
        /// </summary>
        var connection = this;

        if (!connection._subscribedToHubs) {
            connection._subscribedToHubs = true;
            connection.starting(function () {
                // Set the connection's data object with all the hub proxies with active subscriptions.
                // These proxies will receive notifications from the server.
                var subscribedHubs = [];

                $.each(connection.proxies, function (key) {
                    if (this.hasSubscriptions()) {
                        subscribedHubs.push({ name: key });
                        connection.log("Client subscribed to hub '" + key + "'.");
                    }
                });

                if (subscribedHubs.length === 0) {
                    connection.log("No hubs have been subscribed to.  The client will not receive data from hubs.  To fix, declare at least one client side function prior to connection start for each hub you wish to subscribe to.");
                }

                connection.data = connection.json.stringify(subscribedHubs);
            });
        }
    };

    hubConnection.fn.createHubProxy = function (hubName) {
        /// <summary>
        ///     Creates a new proxy object for the given hub connection that can be used to invoke
        ///     methods on server hubs and handle client method invocation requests from the server.
        /// </summary>
        /// <param name="hubName" type="String">
        ///     The name of the hub on the server to create the proxy for.
        /// </param>

        // Normalize the name to lowercase
        hubName = hubName.toLowerCase();

        var proxy = this.proxies[hubName];
        if (!proxy) {
            proxy = hubProxy(this, hubName);
            this.proxies[hubName] = proxy;
        }

        this._registerSubscribedHubs();

        return proxy;
    };

    hubConnection.fn.init.prototype = hubConnection.fn;

    $.hubConnection = hubConnection;

}(window.jQuery, window));
/* jquery.signalR.version.js */
// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.md in the project root for license information.

/*global window:false */
/// <reference path="jquery.signalR.core.js" />
(function ($, undefined) {
    $.signalR.version = "2.1.2";
}(window.jQuery));

<h1 id="voice-call" data-toc-id="voice-call">Voice Call</h1>
<p>The Phone Call app establishes a two-person voice call through Simple Voice Chat. After the call connects, the mod creates a temporary, hidden, and isolated voice group and adds both sides of the call to it.</p>

<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Prerequisites</div>
  <div data-type="admonition-content">
    <p>Both the server and the clients participating in the call need a working Simple Voice Chat connection. The mod metadata requires Simple Voice Chat API 2.6.0 or higher.</p>
    <p>The Phone Call app marks each player as Callable, In a call, or Voice unavailable. Only online players shown as Callable can have a call successfully established.</p>
  </div>
</div>

<h2 id="initiating-and-answering" data-toc-id="initiating-and-answering">Initiating and answering</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">View callable players</div>
    <div data-type="admonition-content">
      <p>Open Phone Call on the phone. The app reads the current online players and shows their voice and call status; it does not list itself.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Place a call</div>
    <div data-type="admonition-content">
      <p>Left-click the target player. The caller sees Calling, and the recipient sees an incoming call UI.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Answer or reject</div>
    <div data-type="admonition-content">
      <p>The recipient can click Answer to establish the call, or click Reject to end this call attempt.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Hang up</div>
    <div data-type="admonition-content">
      <p>Either side can click Hang Up to end the call; the temporary voice group is then removed.</p>
    </div>
  </div>
</div>

<h2 id="when-a-call-cannot-be-placed" data-toc-id="when-a-call-cannot-be-placed">When a call cannot be placed</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Situation</th>
      <th>Result</th>
    </tr>
    <tr>
      <td>Target player is offline</td>
      <td>Caller receives a prompt that the other side is not online</td>
    </tr>
    <tr>
      <td>Calling yourself</td>
      <td>The system rejects the call</td>
    </tr>
    <tr>
      <td>Either side is already in a call</td>
      <td>The system rejects the call</td>
    </tr>
    <tr>
      <td>Either side has voice chat uninstalled, disconnected, or disabled</td>
      <td>The system reports that the corresponding side's voice chat is unavailable</td>
    </tr>
    <tr>
      <td>Incoming call is not answered for over 60 seconds</td>
      <td>The call ends automatically</td>
    </tr>
    <tr>
      <td>A player goes offline or the voice group connection drops during a call</td>
      <td>The call ends and the online side is notified</td>
    </tr>
  </tbody>
</table>

<h2 id="call-scope" data-toc-id="call-scope">Call scope</h2>
<p>The current call model is one-to-one. After the call is answered, both sides are added to the same isolated voice group; the group is temporary and is not retained as a permanent server group.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Voice service stops</div>
  <div data-type="admonition-content">
    <p>When the Simple Voice Chat service stops, all active calls end. After the service is restored, calls must be placed again.</p>
  </div>
</div>

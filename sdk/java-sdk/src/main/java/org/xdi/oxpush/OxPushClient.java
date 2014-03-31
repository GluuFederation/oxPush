package org.xdi.oxpush;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.HttpResponseException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.codehaus.jettison.json.JSONTokener;

/**
 * Provides interface for oxPush REST web services
 *
 * @author Yuriy Movchan Date: 11/15/2013
 */
public class OxPushClient {

	private final HttpClient httpClient;

	private String baseUri;

	/**
	 * Create an oxPush client
	 */
	public OxPushClient(String baseUri) {
		this.baseUri = baseUri;
		this.httpClient = new DefaultHttpClient();
	}

	/**
	 * Determine deployment status
	 * 
	 * @param   deploymentId Id of deployment
	 * @return  A DeploymentStatus object
	 * @throws  OxPushError Thrown when error is occured 
	 */
	public DeploymentStatus getDeploymentStatus(final String deploymentId) throws OxPushError {
		final String requestUri = String.format("%s/%s/%s", baseUri, "check_deployment", deploymentId);

		try {
			JSONObject json = executeGet(requestUri);
			return DeploymentStatus.fromJSON(json);
		} catch (Exception ex) {
			throw new OxPushError("Failed to determine deployment status", ex);
		}
	}

	/**
	 * Initialize pairing process
	 * 
	 * @param   applicationName Application name
	 * @param   userName User name
	 * @return  A PairingStatus object
	 * @throws  OxPushError Thrown when error is occured 
	 */
	public PairingProcess pair(final String applicationName, final String userName) throws OxPushError {
		final String requestUri = String.format("%s/%s/%s/%s", baseUri, "initialize_pairing", applicationName, userName);

		try {
			JSONObject json = executeGet(requestUri);
			return PairingProcess.fromJSON(json);
		} catch (Exception ex) {
			throw new OxPushError("Failed to initialize pairing process", ex);
		}
	}

	/**
	 * Determine current status of a pairing process
	 * 
	 * @param   pairingId The id of pairing process
	 * @return  A PairingStatus object
	 * @throws  OxPushError Thrown when error is occured 
	 */
	public PairingStatus getPairingStatus(final String pairingId) throws OxPushError {
		final String requestUri = String.format("%s/%s/%s", baseUri, "check_pairing", pairingId);

		try {
			JSONObject json = executeGet(requestUri);
			return PairingStatus.fromJSON(json);
		} catch (Exception ex) {
			throw new OxPushError("Failed to determine pairing status", ex);
		}
	}

	/**
	 * Initialize authentication process
	 * 
	 * @param   deploymentId Id of deployment
	 * @param   userName User name
	 * @return  A PairingStatus object
	 * @throws  OxPushError Thrown when error is occured 
	 */
	public AuthenticationProcess authenticate(final String deploymentId, final String userName) throws OxPushError {
		final String requestUri = String.format("%s/%s/%s/%s", baseUri, "authenticate", deploymentId, userName);

		try {
			JSONObject json = executeGet(requestUri);
			return AuthenticationProcess.fromJSON(json);
		} catch (Exception ex) {
			throw new OxPushError("Failed to initialize authentication process", ex);
		}
	}

	/**
	 * Determine current status of a authentication process
	 * 
	 * @param   authenticationId The id of authentication process
	 * @return  A PairingStatus object
	 * @throws  OxPushError Thrown when error is occured 
	 */
	public AuthenticationStatus getAuthenticationStatus(final String authenticationId) throws OxPushError {
		final String requestUri = String.format("%s/%s/%s", baseUri, "check_authentication", authenticationId);

		try {
			JSONObject json = executeGet(requestUri);
			return AuthenticationStatus.fromJSON(json);
		} catch (Exception ex) {
			throw new OxPushError("Failed to determine authentication status", ex);
		}
	}

	private JSONObject executeGet(String endpointUri) throws Exception {
		HttpGet httpGet = new HttpGet(endpointUri);
		return httpClient.execute(httpGet, responseHandler);
	}

	private static ResponseHandler<JSONObject> responseHandler = new ResponseHandler<JSONObject>() {
		@Override
		public JSONObject handleResponse(final HttpResponse httpResponse) throws IOException {
			JSONObject result = null;

			if (httpResponse != null) {
				StatusLine statusLine = httpResponse.getStatusLine();
				switch (statusLine.getStatusCode()) {
				case HttpStatus.SC_OK:
					HttpEntity entity = httpResponse.getEntity();
					if (entity != null) {
						String json = EntityUtils.toString(entity);
						try {
							result = (JSONObject) new JSONTokener(json).nextValue();
						} catch (JSONException ex) {
							throw new ClientProtocolException("Failed to parse JSON", ex);
						}
					}
					break;
				default:
					throw new HttpResponseException(statusLine.getStatusCode(), statusLine.getReasonPhrase());
				}
			}

			return result;
		}
	};
}

package org.xdi.oxpush;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 * Provides information about authentication process
 * 
 * @author Yuriy Movchan Date: 11/15/2013
 */
public class AuthenticationProcess {

	/**
	 * Pairing id of the authentication process
	 */
	public String authenticationId;

	/**
	 * Expiration time of authentication process
	 */
	public long expiresIn;

	/**
	 * Result of authentication process
	 */
	public boolean result;

	@Override
	public String toString() {
		return String.format("[AuthenticationProcess: authentication_id=%s; expires_in=%s; result=%b]", authenticationId, expiresIn, result);
	}

	public static AuthenticationProcess fromJSON(JSONObject json) throws JSONException {
		AuthenticationProcess authenticationResponse = new AuthenticationProcess();

		authenticationResponse.result = json.getBoolean("result");
		if (authenticationResponse.result) {
			authenticationResponse.authenticationId = json.getString("authentication_id");
			authenticationResponse.expiresIn = json.getLong("expires_in");
		}

		return authenticationResponse;
	}

}

package org.xdi.oxpush;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 * Provides information about authentication
 * 
 * @author Yuriy Movchan Date: 11/15/2013
 */
public class AuthenticationStatus {

	/**
	 * Pairing process
	 */
	public String status;

	/**
	 * Result of authentication process
	 */
	public boolean result;

	@Override
	public String toString() {
		return String.format("[AuthenticationStatus: authentication_status=%s; result=%b]", status, result);
	}

	public static AuthenticationStatus fromJSON(JSONObject json) throws JSONException {
		AuthenticationStatus authenticationResponse = new AuthenticationStatus();

		authenticationResponse.result = json.getBoolean("result");
		if (authenticationResponse.result) {
			authenticationResponse.status = json.getString("authentication_status");
		}

		return authenticationResponse;
	}

}

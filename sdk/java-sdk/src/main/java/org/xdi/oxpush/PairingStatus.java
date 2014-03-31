package org.xdi.oxpush;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 * Provides information about pairing
 * 
 * @author Yuriy Movchan Date: 11/15/2013
 */
public class PairingStatus {

	/**
	 * Pairing id of the deployment
	 */
	public String deploymentId;

	/**
	 * Pairing process
	 */
	public String status;

	/**
	 * Result of pairing process
	 */
	public boolean result;

	@Override
	public String toString() {
		return String.format("[PairingStatus: deployment_id=%s; pairing_status=%s; result=%b]", deploymentId, status, result);
	}

	public static PairingStatus fromJSON(JSONObject json) throws JSONException {
		PairingStatus pairingResponse = new PairingStatus();

		pairingResponse.result = json.getBoolean("result");
		if (pairingResponse.result) {
			if (json.has("deployment_id")) {
				pairingResponse.deploymentId = json.getString("deployment_id");
			}

			pairingResponse.status = json.getString("pairing_status");
		}

		return pairingResponse;
	}

}

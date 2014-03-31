package org.xdi.oxpush;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 * Provides information about deployment
 * 
 * @author Yuriy Movchan Date: 11/19/2013
 */
public class DeploymentStatus {

	/**
	 * Pairing process
	 */
	public String status;

	/**
	 * Result of deployment process
	 */
	public boolean result;

	@Override
	public String toString() {
		return String.format("[DeploymentStatus: deployment_status=%s; result=%b]", status, result);
	}

	public static DeploymentStatus fromJSON(JSONObject json) throws JSONException {
		DeploymentStatus deploymentResponse = new DeploymentStatus();

		deploymentResponse.result = json.getBoolean("result");
		if (deploymentResponse.result) {
			deploymentResponse.status = json.getString("deployment_status");
		}

		return deploymentResponse;
	}

}

package org.xdi.oxpush;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 * Provides information about pairing process
 * 
 * @author Yuriy Movchan Date: 11/15/2013
 */
public class PairingProcess {

	/**
	 * Pairing id of the pairing process
	 */
	public String pairingId;

	/**
	 * Expiration time of pairing process
	 */
	public long expiresIn;

	/**
	 * User friendly pairing code
	 */
	public String pairingCode;

	/**
	 * QR representation of pairing code
	 */
	public String pairingQrImage;

	/**
	 * Result of pairing process
	 */
	public boolean result;

	@Override
	public String toString() {
		return String.format("[PairingProcess: pairing_id=%s; pairing_code=%s; pairing_qr_image=%s; expires_in=%s; result=%b]", pairingId, pairingCode, pairingQrImage, expiresIn, result);
	}

	public static PairingProcess fromJSON(JSONObject json) throws JSONException {
		PairingProcess pairingResponse = new PairingProcess();

		pairingResponse.result = json.getBoolean("result");
		if (pairingResponse.result) {
			pairingResponse.pairingId = json.getString("pairing_id");
			pairingResponse.pairingCode = json.getString("pairing_code");
			pairingResponse.pairingQrImage = json.getString("pairing_qr_image");
			pairingResponse.expiresIn = json.getLong("expires_in");
		}

		return pairingResponse;
	}

}

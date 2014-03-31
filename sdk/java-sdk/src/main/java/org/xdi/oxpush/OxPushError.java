package org.xdi.oxpush;

/**
 * Request errors from API calls
 * 
 * @author Yuriy Movchan Date: 11/15/2013
 */
public class OxPushError extends Exception {

	private static final long serialVersionUID = -6047568957313139177L;

	/**
	 * Constructs a new exception with the specified detail message and cause.
	 *
	 * @param  message The detail message
	 * @param  cause The cause
	 */
	public OxPushError(String message, Throwable cause) {
		super(message, cause);
	}
}

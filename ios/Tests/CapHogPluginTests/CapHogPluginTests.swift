import XCTest
@testable import CapHogPlugin

class CapHogTests: XCTestCase {
    func testEcho() {
        // This is an example of a functional test case for a plugin.
        // Use XCTAssert and related functions to verify your tests produce the correct results.

        let implementation = CapHog()
        let value = "Hello, World!"
        let result = implementation.echo(value)

        XCTAssertEqual(value, result)
    }
}

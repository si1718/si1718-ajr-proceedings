/*global browser, element, by, expect*/
describe('Proceedings is loaded', function () {
	it('should show a bunch of proceedings', function (){
		browser.get('http://localhost:8080/');
		
		expect(browser.getTitle()).toEqual('Proceeding');
		//browser.driver.sleep(2000);
		
		var proceedings = element.all(by.repeater('proceeding in proceedings'));
		expect(proceedings.count()).toBeGreaterThan(2);
	});
});
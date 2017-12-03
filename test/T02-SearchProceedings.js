/*global browser, element, by, expect*/
describe('Proceedings of searching is loaded', function () {
	it('should show a bunch of proceedings by searching', function (){
		browser.get('http://localhost:8080');
		var contacts = element.all(by.repeater('proceeding in proceedings'));
		expect(contacts.count()).toBeGreaterThan(2);
	});
});
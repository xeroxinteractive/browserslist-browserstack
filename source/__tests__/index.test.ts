import * as moduleUnderTest from '../index';

describe('getCapabilities', () => {
    describe('options', () => {
        test('IE 10', async() => {
            await expect(moduleUnderTest.default({
                browserslist: {
                    queries: 'IE 10'
                }
            })).resolves.toMatchSnapshot();
        });
        test.skip('IE 10 + Windows 7 OS filter', async() => {
            await expect(moduleUnderTest.default({
                browserslist: {
                    queries: 'IE 10'
                },
                operatingSystems: {
                    include: [
                        moduleUnderTest.OperatingSystemFilter.WINDOWS
                    ]
                }
            })).resolves.toMatchSnapshot();
        });
    });
});
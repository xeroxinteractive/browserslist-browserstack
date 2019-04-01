import * as moduleUnderTest from '../index';
import mockFetch from '../__mocks__/node-fetch';

describe('getCapabilities', () => {
  describe('browserslist options', () => {
    test('single browser query', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: 'IE 10'
          }
        })
      ).resolves.toMatchSnapshot();
    });

    test('multiple browser query', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: ['IE 10', 'Edge 18']
          }
        })
      ).resolves.toMatchSnapshot();
    });

    test('last 2 versions', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: 'last 2 versions'
          }
        })
      ).resolves.toMatchSnapshot();
    });

    test('invalid query', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: 'invalid'
          }
        })
      ).rejects.toEqual(
        new moduleUnderTest.BrowsersListError(
          'Unknown browser query `invalid`. Maybe you are using old Browserslist or made typo in query.'
        )
      );
    });

    test('invalid credentials', async () => {
      mockFetch.mockImplementationOnce((...args) =>
        require.requireActual('node-fetch').default(...args)
      );
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: 'invalid'
          }
        })
      ).rejects.toEqual(new moduleUnderTest.ResponseError('Unauthorized', 401));
    });
  });
  describe('OS Filtering', () => {
    test('os + os version include filters', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: 'IE 10'
          },
          operatingSystems: {
            include: [moduleUnderTest.OperatingSystemFilter.WINDOWS]
          },
          operatingSystemVersion: {
            include: [
              moduleUnderTest.WindowsOperatingSystemVersionFilter.SEVEN,
              moduleUnderTest.WindowsOperatingSystemVersionFilter.TEN,
              moduleUnderTest.WindowsOperatingSystemVersionFilter.XP
            ]
          }
        })
      ).resolves.toMatchSnapshot();
    });

    test('os + os version exclude filters', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: 'Firefox 42'
          },
          operatingSystems: {
            exclude: [moduleUnderTest.OperatingSystemFilter.OSX]
          },
          operatingSystemVersion: {
            exclude: [
              moduleUnderTest.WindowsOperatingSystemVersionFilter.EIGHT_ONE,
              moduleUnderTest.WindowsOperatingSystemVersionFilter.EIGHT
            ]
          }
        })
      ).resolves.toMatchSnapshot();
    });

    test('os + os version include + exclude filters', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: 'Firefox 42'
          },
          operatingSystems: {
            include: [moduleUnderTest.OperatingSystemFilter.OSX],
            exclude: [moduleUnderTest.OperatingSystemFilter.WINDOWS]
          },
          operatingSystemVersion: {
            exclude: [
              moduleUnderTest.OSXOperatingSystemVersionFilter.LION,
              moduleUnderTest.OSXOperatingSystemVersionFilter.HIGH_SIERRA,
              moduleUnderTest.WindowsOperatingSystemVersionFilter.EIGHT
            ]
          }
        })
      ).resolves.toMatchSnapshot();
    });
  });

  describe('browser filtering', () => {
    test('browser include filter', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: ['Chrome 72', 'Opera 12', 'Edge 18', 'IE 10']
          },
          browsers: {
            include: [
              moduleUnderTest.BrowserFilter.EDGE,
              moduleUnderTest.BrowserFilter.IE
            ]
          }
        })
      ).resolves.toMatchSnapshot();
    });
    test('browser exclude filter', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: ['Chrome 72', 'Opera 12', 'Edge 18', 'IE 10']
          },
          browsers: {
            exclude: [
              moduleUnderTest.BrowserFilter.OPERA,
              moduleUnderTest.BrowserFilter.CHROME
            ]
          }
        })
      ).resolves.toMatchSnapshot();
    });
    test('browser include + exclude filter', async () => {
      await expect(
        moduleUnderTest.default({
          browserslist: {
            queries: ['Chrome 72', 'Opera 12', 'Edge 18', 'IE 10']
          },
          browsers: {
            include: [moduleUnderTest.BrowserFilter.EDGE],
            exclude: [
              moduleUnderTest.BrowserFilter.OPERA,
              moduleUnderTest.BrowserFilter.CHROME
            ]
          }
        })
      ).resolves.toMatchSnapshot();
    });

    test('formatting for selenium', async () => {
      const capabilities = await moduleUnderTest.default({
        browserslist: {
          queries: 'IE 10'
        },
        formatForSelenium: false
      });
      for (const capability of capabilities) {
        expect(capability).not.toHaveProperty('browserName');
        expect(capability).not.toHaveProperty('browserVersion');
      }
    });
  });
});

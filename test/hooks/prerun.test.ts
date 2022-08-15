import {expect, test} from '@oclif/test'

describe.skip('hooks', () => {
  test
    .stdout()
    .hook('init', {id: 'mycommand'})
    .do(output => expect(output.stdout).to.contain('example hook running mycommand'))
    .it('shows a message')
})

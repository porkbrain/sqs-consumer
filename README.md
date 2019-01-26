# AWS SQS Consumer

**Description**:  Polls the Amazon Web Services Simple Queue Service and dispatches messages to the listeners.
Messages handy functions, such as `delete` or `changeVisibility`, and the body is transformed by a transformer
function.

## Dependencies

This package was meant to be used along with Typescript. The only production dependency is the AWS SDK. 

## Installation

`npm i @bausano/sqs-consumer`

## Configuration

Since this package is built on top of the AWS SDK, the correct access tokens and regions have to be
set in the node enviroment variables.
Please refer to [this guide](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html)
for further instructions on how to configure the service.

When constructing the `SQS` object for consumer, lock the version of the APIS:

`const sqs: AWS.SQS = new AWS.SQS({ apiVersion: '2012-11-05' })`

## Usage

Show users how to use the software.
Be specific.
Use appropriate formatting when showing code snippets.

## How to test the software

If the software includes automated tests, detail how to run those tests.

## Known issues

Document any known significant shortcomings with the software.

## Getting help

Instruct users how to get help with this software; this might include links to an issue tracker, wiki, mailing list, etc.

**Example**

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.

## Getting involved

This section should detail why people should get involved and describe key areas you are
currently focusing on; e.g., trying to get feedback on features, fixing certain bugs, building
important pieces, etc.

General instructions on _how_ to contribute should be stated with a link to [CONTRIBUTING](CONTRIBUTING.md).


----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)


----

## Credits and references

1. Projects that inspired you
2. Related projects
3. Books, papers, talks, or other sources that have meaningful impact or influence on this project

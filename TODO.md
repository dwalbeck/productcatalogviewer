# Areas for improvement

### DB Schema

- break out **'retailer'** and **'brand'** into their own tables, which will not only allow more information to be attached to each entity, but also would inherently make the definition for each be defined in a single place - rather than requiring compliation of all products for unique names, which is prone to inadvertent duplication on mis-spellings or capitalization differences.
- replace **retailer** and **brand** columns in product table to use foreign key references
- add **product_active** as a boolean column to product table for easy filtering of discontinued products while retaining history and linked data to products.
- add **product_count** column to product table to enable inventory tracking and availability
- add **created** and **updated** timestamp columns to tables for tracking date info on each entity (handy to have for debugging issues and other things)
- change product table primary key to use a sequence or UUID that is auto-assigned. allowing the primary key to be supplied, increases the probability for submissions with duplicate records existing

### API

- add OAuth2 authentication with asymmetrical key pair signing on JWT tokens for security
- add Swagger/OpenAPI annotations to code for documentation on API end points
- include and enforce variable validation on all user supplied values to protect against SQL injection
- add integration tests for testing interactions between services

### Web

- add pagination for listing all products to improve visual aesthetics and user experience
- improve upon the product search to automatically match against multiple columns of relevance
- add filtering capability for things like **brand** and **retailer** and even **price range**
- make order of product listing consistent for better user experience and sanity

### Docker / Git

- pull environment variables from config and use a vault or secrets manager for variable retrieval for use in the config per environment for deployment
- add Github Action to ensure test execution and passing status before code deployment
- add code checker to deployment process to insure coding standards and quality are enforced
- add healthcheck on frontend service


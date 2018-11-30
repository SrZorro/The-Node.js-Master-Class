# Pirple - The Node.js Master Class

## Homework Assignment #1

Post mortem notes / questions:

### eslint?

I can't live without code linting. Thats why the `.eslintrc.json` file is present in the repo, not sure if the rules of no npm modules let linters.

### Can I use Typescript?

We can't use npm modules, and [typescript](https://www.npmjs.com/package/typescript) is a module. But tecnically [eslint](https://www.npmjs.com/package/eslint) its also a module. Are modules not directly used in the code valid? In this case I used eslint but NOT typescript as the former is just a linter but the second one a transpiler. Not sure where the line is or if there is one of what its fare or not to use.

### Routes folder

I thought about maping one file to one route/path, to complicate the project (as it was to easy the base assignment), also added suport for regex in the path matching, internal routes for self resolving, just to make it more fun and future proof.

### Overcomplicated the assignment

Yes, this assignment could be really compact, but I thought its better to future proof the package instead of making a really targeted code for one specific job (aka answering the `/hello` endpoint).

### Certs folder

I ignored that folder as contains sensible data that shouldn't be in git. I feel that pushing passwords to the repo and pushing the certs are the same kind of bad practice, so I ignored that folder.
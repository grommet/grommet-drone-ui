import React from 'react';

import Paragraph from 'grommet/components/Paragraph';

import { addRepo } from '../actions/repo';
import { getAll } from '../api/repo';

export default (cli) => {
  cli.command(
    'add [project]',
    'This command adds a project to this drone instance.',
    (
      <Paragraph margin='none'>
        Here is an example: <code>add myProject</code>
      </Paragraph>
    )
  )
  .validate((args) => {
    if (!args.project) {
      return 'Project name is required.';
    }
    return true;
  })
  .action((args, dispatch) => (
    getAll()
      .then(
        (repos) => {
          let repoMatch;
          (repos || []).some((repo) => {
            if (repo.name === args.project || repo.full_name === args.project) {
              repoMatch = repo;
            }
            return repoMatch;
          });

          if (repoMatch) {
            if (!repoMatch.id) {
              dispatch(addRepo(repoMatch));
              return Promise.resolve(
                `Perfect, I've successfully triggered your request to add ${repoMatch.full_name}.`
              );
            }
            return Promise.reject(`
              ${args.project} is already enabled, nothing to be done here.
            `);
          }

          return Promise.reject(`
            Too bad, I could not find  ${args.project} project.
          `);
        },
        () => Promise.reject(`
          Darn, something went wrong trying to locate ${args.project}.
        `)
      )
  ));
};

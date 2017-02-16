import React from 'react';

import Paragraph from 'grommet/components/Paragraph';

import { removeRepo } from '../actions/repo';
import { getAll } from '../api/repo';

export default (cli) => {
  cli.command(
    'remove [project]',
    'This command removes a project from this drone instance.',
    (
      <Paragraph margin='none'>
        Here is an example: <code>remove myProject</code>
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
            dispatch(removeRepo(repoMatch));
            return Promise.resolve(
              `Perfect, I've successfully triggered your request to remove ${repoMatch.full_name}.`
            );
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

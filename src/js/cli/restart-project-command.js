import React from 'react';

import Paragraph from 'grommet/components/Paragraph';

import store from '../store';

import { restart, getBuilds } from '../api/repo';

export default (cli) => {
  cli.command(
    'restart [project]',
    'This command restarts a build in a given project.',
    (
      <Paragraph margin='none'>
        Here is an example: <code>restart myProject --buildNumber=10</code>
      </Paragraph>
    )
  )
  .option(
    'buildNumber', (
      <Paragraph margin='none'>
        If you don&apos;t get around to specifying
        a <code>buildNumber</code>, don&apos;t worry, I will use your
        latest one.
      </Paragraph>
    )
  )
  .validate((args) => {
    if (!args.project) {
      return 'Project name is required.';
    }
    return true;
  })
  .action((args) => {
    let repoMatch;
    store.getState().user.repos.some((repo) => {
      if (repo.name === args.project || repo.full_name === args.project) {
        repoMatch = repo;
      }
      return repoMatch;
    });

    if (repoMatch) {
      if (repoMatch.status === 'pending' || repoMatch.status === 'running') {
        return Promise.reject(
          `You need to wait, ${args.project} is already ${repoMatch.status}.`
        );
      }
      return getBuilds(repoMatch.full_name).then(
        (builds) => {
          if (!builds || builds.length === 0) {
            return Promise.reject(
              `Bad news, ${args.project} does not have any build to restart.`
            );
          }
          let buildMatch;
          if (args.options.buildNumber) {
            builds.some((build) => {
              if (build.number.toString() === args.options.buildNumber) {
                buildMatch = build;
              }
              return buildMatch;
            });

            if (!buildMatch) {
              return Promise.reject(
                `Oh sorry, I could not find a build with number ${args.options.buildNumber}.`
              );
            }
          } else {
            buildMatch = builds[0];
          }
          return restart(repoMatch.full_name, buildMatch.number).then(() => (
            Promise.resolve(
              `Good news, I was able to restart ${repoMatch.full_name} #${buildMatch.number}`
            )
          ), () => (
            Promise.reject(
              `Something went wrong while restarting ${repoMatch.full_name} #${buildMatch.number}`
            )
          ));
        },
        () => Promise.reject(
          'Sorry something went wrong trying to load the builds.'
        ));
    }
    return Promise.reject(`Well, I could not find ${args.project} project.`);
  });
};

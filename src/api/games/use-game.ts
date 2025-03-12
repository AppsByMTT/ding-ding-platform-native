import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

type Response = any;
type Variables = { slug: string; token: string }; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const useGame = createQuery<Response, Variables, AxiosError>({
  queryKey: ['gameUrl'],
  fetcher: (variable) => {
    return client
      .get(`api/games/${variable.slug}`, {
        withCredentials: true,
        headers: {
          Cookie: `userToken=${variable.token}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error fetching game data:', error);
        throw error; // Ensure the error is still propagated
      });
  },
});

// import type { AxiosError } from 'axios';
// import { createQuery } from 'react-query-kit';
//
// import { client } from '../common';
// import type { Post } from './types';
//
// type Variables = { id: string };
// type Response = Post;
//
// export const usePost = createQuery<Response, Variables, AxiosError>({
//   queryKey: ['posts'],
//   fetcher: (variables) => {
//     return client
//       .get(`posts/${variables.id}`)
//       .then((response) => response.data);
//   },
// });

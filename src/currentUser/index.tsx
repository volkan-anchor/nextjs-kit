import { useQuery } from '@apollo/client';
import USER_QUERY from './currentUser.graphql';

const CurrentUser = () => {
  const { data } = useQuery(USER_QUERY);

  return (
    <div>
      <h1>Current User: </h1>
      <div>
        {data?.currentUser?.secureName ?? "not found"}
      </div>
    </div>
  );
};

export default CurrentUser;

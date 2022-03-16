import { useQuery } from '@apollo/client';
import USER_QUERY from './currentUser.graphql';

const CurrentUser = () => {
  const { data, error } = useQuery(USER_QUERY);

  console.log("USER_QUERY error: ", error)
  console.log("USER_QUERY data: ", data)

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

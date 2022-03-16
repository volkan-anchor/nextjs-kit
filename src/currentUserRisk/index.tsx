import { useQuery } from '@apollo/client';
import RISK_USER_QUERY from './currentUserRisk.graphql';

const CurrentUserRisk = () => {
  const { data, error } = useQuery(RISK_USER_QUERY);

  console.log("RISK_USER_QUERY error: ", error)
  console.log("RISK_USER_QUERY data: ", data)

  return (
    <div>
      <h1>Current Risk User: </h1>
      <div>
        {data?.currentRiskUser?.email ?? "not found"}
      </div>
    </div>
  );
};

export default CurrentUserRisk;

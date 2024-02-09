import { ENDPOINT } from '@/config';
import axios from 'axios';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const GLOBAL_AXIOS = axios;

const useAxiosAuth = () => {
	const { data: session, status } = useSession();
	const axiosAuth = GLOBAL_AXIOS;

	useEffect(() => {
		axiosAuth.defaults.baseURL = ENDPOINT;
		if (status === 'authenticated' && session) {
			axiosAuth.defaults.headers.common['Authorization'] = `Bearer ${session.user.accessToken}`;
		}
	}, [axiosAuth, status, session]);

	return axiosAuth;
};

export default useAxiosAuth;

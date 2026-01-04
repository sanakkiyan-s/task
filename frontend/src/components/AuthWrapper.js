
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { setCredentials, logout } from '../store/authSlice';

const AuthWrapper = ({ children }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                        dispatch(setCredentials({
                            user: {
                                ...session.user,
                                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
                            },
                            token: session.access_token
                        }));
                    
                }
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                dispatch(setCredentials({
                    user: {
                        ...session.user,
                        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
                    },
                    token: session.access_token
                }));
            } else {
                dispatch(logout());
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Loading...
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;

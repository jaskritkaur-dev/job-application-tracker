import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: NextRequest) {
    try {
        const supabaseUrl =
            process.env.NEXT_PUBLIC_SUPABASE_URL;

        const publishableKey =
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        const serviceRoleKey =
            process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (
            !supabaseUrl ||
            !publishableKey ||
            !serviceRoleKey
        ) {
            return NextResponse.json(
                {
                    error:
                        "Server configuration is incomplete.",
                },
                {
                    status: 500,
                }
            );
        }

        const authorization =
            request.headers.get("authorization");

        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return NextResponse.json(
                {
                    error: "Unauthorized.",
                },
                {
                    status: 401,
                }
            );
        }

        const accessToken =
            authorization.replace("Bearer ", "");

        const userClient = createClient(
            supabaseUrl,
            publishableKey,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
            }
        );

        const {
            data: { user },
            error: userError,
        } = await userClient.auth.getUser(
            accessToken
        );

        if (
            userError ||
            !user
        ) {
            return NextResponse.json(
                {
                    error:
                        "Your session could not be verified.",
                },
                {
                    status: 401,
                }
            );
        }

        const adminClient =
            createClient(
                supabaseUrl,
                serviceRoleKey,
                {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false,
                    },
                }
            );

        const {
            error: applicationsError,
        } = await adminClient
            .from("applications")
            .delete()
            .eq("user_id", user.id);

        if (applicationsError) {
            console.error(
                "Application deletion error:",
                applicationsError
            );

            return NextResponse.json(
                {
                    error:
                        "Could not delete your application data.",
                },
                {
                    status: 500,
                }
            );
        }

        const {
            error: deleteUserError,
        } =
            await adminClient.auth.admin.deleteUser(
                user.id
            );

        if (deleteUserError) {
            console.error(
                "User deletion error:",
                deleteUserError
            );

            return NextResponse.json(
                {
                    error:
                        "Could not delete your account.",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Delete account error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Something went wrong while deleting your account.",
            },
            {
                status: 500,
            }
        );
    }
}
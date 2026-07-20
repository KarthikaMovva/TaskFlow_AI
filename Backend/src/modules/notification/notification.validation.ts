import { z } from "zod";


/*
    =====================================================
    Notification Validation
    =====================================================

    Validates notification related requests.

*/


/*
    Validate notification id
*/

export const notificationIdSchema = z.object({

    notificationId:

        z.string()
            .uuid(
                "Invalid notification id"
            )

});
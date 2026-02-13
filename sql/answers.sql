/*
ASSUMPTIONS

1. "Active subscription" means:
   - status = 'active'
   - We do NOT additionally check end_date (assuming status is source of truth).

2. A creator may have multiple active subscriptions.
   - Revenue = SUM(plan_price) of active subscriptions.

3. Conversion in Q3:
   - A creator is counted as "with active subscription"
     if they have at least ONE active subscription.
   - Each creator counted only once.

4. Revenue efficiency (Q4):
   - revenue = SUM(plan_price) from active subscriptions
   - views = SUM(views) from all posts
   - If total views = 0, we EXCLUDE the creator
     (to avoid division by zero and misleading metrics).
*/

/*
Q1 Posts per creator
Approach:
LEFT JOIN posts so creators with zero posts are included.
GROUP BY creator.
*/


SELECT
    c.name AS creator_name,
    COUNT(p.id) AS total_posts
FROM creators c
LEFT JOIN posts p ON p.creator_id = c.id
GROUP BY c.id, c.name
ORDER BY total_posts DESC;



/* 
Q2 Current active revenue per creator
Approach:
Filter subscriptions to status = 'active'.
Sum plan_price per creator.
LEFT JOIN so creators with no active subscriptions show 0.
 */

SELECT
    c.name AS creator_name,
    COALESCE(SUM(s.plan_price), 0) AS current_revenue
FROM creators c LEFT JOIN subscriptions s ON s.creator_id = c.id AND s.status = 'active'
GROUP BY c.id, c.name
ORDER BY current_revenue DESC;



/*
Q3 Jan 2025 cohort conversion
Approach:
1. First, select creators who signed up in January 2025.

2. LEFT JOIN the subscriptions table,
   but only include subscriptions where status = 'active'.
   We use LEFT JOIN so that creators without subscriptions
   are still included.

3. Count total creators using COUNT(DISTINCT c.id).

4. Count creators with active subscriptions using
   COUNT(DISTINCT s.creator_id).
   COUNT ignores NULL, so only converted creators are counted.

5. Calculate conversion_rate by dividing:
   creators_with_active_subscription / creators_signed.

6. Group by signup_date to get daily cohort numbers.
*/

SELECT
    c.signup_date,
    COUNT(DISTINCT c.id) AS creators_signed,
    COUNT(DISTINCT s.creator_id) AS creators_with_active_subscription,
    ROUND(COUNT(DISTINCT s.creator_id)::numeric / NULLIF(COUNT(DISTINCT c.id), 0),4) AS conversion_rate
FROM creators c LEFT JOIN subscriptions s ON s.creator_id = c.id AND s.status = 'active'
WHERE c.signup_date >= '2025-01-01' AND c.signup_date <  '2025-02-01'
GROUP BY c.signup_date
ORDER BY c.signup_date;


/*
Q4 — Revenue efficiency metric
Find top 3 creators based on revenue_per_1000_views.

Appr:
1. First calculate total active subscription revenue per creator.
2. Then calculate total views per creator from posts.
3. Join both results with creators table.
4. Exclude creators who have 0 views (to avoid division by zero).
5. Calculate: revenue_per_1000_views = revenue / (views / 1000)
6. Sort in descending order and take top 3.
*/

WITH 
revenue_per_creator AS (
    SELECT
        creator_id,
        SUM(plan_price) AS revenue
    FROM subscriptions
    WHERE status = 'active'
    GROUP BY creator_id
),
views_per_creator AS (
    SELECT
        creator_id,
        SUM(views) AS views
    FROM posts
    GROUP BY creator_id
)

SELECT
    c.name AS creator_name,
    COALESCE(r.revenue, 0) AS revenue,
    v.views,
    ROUND(
        COALESCE(r.revenue, 0)
        /
        (v.views / 1000.0),
        2
    ) AS revenue_per_1000_views
FROM creators c
LEFT JOIN revenue_per_creator r
    ON r.creator_id = c.id
LEFT JOIN views_per_creator v
    ON v.creator_id = c.id

WHERE v.views > 0

ORDER BY revenue_per_1000_views DESC
LIMIT 3;





/* 
BONUS — Suggested Indexes (Beginner-Friendly Names)

1. Speed up Q3 (filter by signup date + active subscriptions)
*/

CREATE INDEX index_on_creators_signup_date
ON creators(signup_date);

CREATE INDEX index_on_subscriptions_status_and_creator
ON subscriptions(status, creator_id);


/*
2. Speed up Q4 (grouping posts by creator)
*/

CREATE INDEX index_on_posts_creator_id
ON posts(creator_id);


/*
These indexes help with:

- Faster filtering by signup_date (for cohort analysis)
- Faster filtering of active subscriptions
- Faster grouping and joining by creator_id
*/

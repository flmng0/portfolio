---
layout: project
title: Cabinet
description: >
  Self-hosted invoicing system, targetting freelance developers.
source: https://github.com/flmng0/cabinet
post: true
---

<script>
  import exampleInvoice from "$assets/projects/cabinet-example-invoice.png"
</script>

# Cabinet

Cabinet is a simple, self-hosted invoicing system. The goal of the project was just to have a quick way to send my clients invoices.

When I was designing it, I tried my best to make it re-usable for others in the future.

See below for a screenshot of an example invoice:

![Example Invoice]({exampleInvoice})


## Configuration

In the example invoice screenshot, note the following sections:

- The invoice title: "INVOICE"
- "`from`"
- "`payment`"
- The additional inquiries footer.

All of them may be configured, some with environment variables, and some are per-invoice.

For example, if I register for GST sometime in the future, then any new invoices will instead be labelled "TAX INVOICE", and have the appropriate GST applied in the total.


## Implementation Details

Cabinet was implemented using [Phoenix], with LiveViews used for the admin-panel, and "dead-views" used for the user-facing pages.

### Admin Panel

A large focus of the project was the ability to quickly create manage invoices. I didn't want to create anything to complex, as I wanted to complete the project quickly.

The hierarchy of data in Cabinet is: Client -> Invoice -> Unit.

So, a client owns invoices, which themselves own units.

### Client Access

Clients can access invoices in one of two ways.

1. When configuring a client, you can add login emails for the client. If the client has a login email, they can see all of their invoices by logging in.

2. If you don't anticipate the client having multiple invoices, you can instead generate an access link.

Both of the above make heavy use of the new [Phoenix 1.8] [Scopes] feature.


## Final Thoughts

Overall, I am happy with being able to complete this project, and I have already used it to invoice clients for other work.

Cabinet is open-source under the MIT licence, so feel free to poke around if you want to use it yourself. I plan to fully document setting Cabinet up in the future.

[Phoenix]: https://phoenixframework.org
[Phoenix 1.8]: https://phoenixframework.org/blog/phoenix-1-8-released
[Scopes]: https://hexdocs.pm/phoenix/1.8.3/scopes.html

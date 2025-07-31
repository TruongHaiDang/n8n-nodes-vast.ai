/* eslint-disable n8n-nodes-base/node-param-resource-with-plural-option */
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class VastAiNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Vast AI',
		name: 'vastAiNode',
		group: ['vast.ai'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Get all informations of an account.',
		defaults: {
			name: 'Accounts',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'vastAICredentialsApi', // phải khớp với `name` trong file credentials
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Accounts', value: 'accounts' },
					// { name: 'Billing', value: 'billing' },
					// { name: 'Instances', value: 'instances' },
					// { name: 'Machines', value: 'machines' },
					// { name: 'Search', value: 'search' },
					// { name: 'Serverless', value: 'serverless' },
					// { name: 'Team', value: 'team' },
					// { name: 'Template', value: 'template' },
					// { name: 'Volumes', value: 'volumes' },
				],
				default: 'accounts',
				description: 'Select resource',
			},
			{
				displayName: 'API Group Name or ID',
				name: 'api',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getApis',
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	};
	methods = {
		loadOptions: {
			async getApis(this: ILoadOptionsFunctions) {
				const resource = this.getCurrentNodeParameter('resource');
				switch(resource) {
					case 'instances':
						return [
							// { name: 'Attach SSH-Key', value: 'attach_ssh_key_post' },
							// { name: 'Cancel Copy', value: 'cancel_copy_delete' },
							// { name: 'Copy', value: 'copy_put' },
							// { name: 'Cancel Sync', value: 'cancel_sync_delete' },
							// { name: 'Cloud Copy', value: 'cloud_copy_post' },
							// { name: 'Change Bid', value: 'change_bid_put' },
							// { name: 'Create Instance', value: 'create_instance_put' },
							// { name: 'Destroy Instance', value: 'destroy_instance_delete' },
							// { name: 'Manage Instance', value: 'manage_instance_put' },
							// { name: 'Show Instance', value: 'show_instance_get' },
							// { name: 'Detach SSH-Key', value: 'detach_ssh_key_delete' },
							// { name: 'Execute', value: 'execute_put' },
							// { name: 'Show Logs', value: 'show_logs_put' },
							// { name: 'Prepay Instance', value: 'prepay_instance_put' },
							// { name: 'Reboot Instance', value: 'reboot_instance_put' },
							// { name: 'Recycle Instance', value: 'recycle_instance_put' },
							// { name: 'Show SSH-Keys', value: 'show_ssh_keys_get' },
							// { name: 'Show Instances', value: 'show_instances_get' },
						];
					case 'machines':
						return [
							// { name: 'Cancel Maint', value: 'cancel_maint_put' },
							// { name: 'Cleanup Machine', value: 'cleanup_machine_put' },
							// { name: 'List Machine', value: 'list_machine_put' },
							// { name: 'Remove Defjob', value: 'remove_defjob_delete' },
							// { name: 'Show Reports', value: 'show_reports_get' },
							// { name: 'Schedule Maint', value: 'schedule_maint_put' },
							// { name: 'Set Defjob', value: 'set_defjob_put' },
							// { name: 'Set Min-Bid', value: 'set_min_bid_put' },
							// { name: 'Show Machines', value: 'show_machines_get' },
							// { name: 'Unlist Machine', value: 'unlist_machine_delete' },
						];
					case 'accounts':
						return [
							// { name: 'Create Api-Key', value: 'create_api_key_post' },
							{ name: 'Show Api Keys', value: 'show_api_keys_get' },
							// { name: 'Create Env-Var', value: 'create_env_var_post' },
							// { name: 'Delete Env Var', value: 'delete_env_var_delete' },
							{ name: 'Show Env Vars', value: 'show_env_vars_get' },
							// { name: 'Update Env Var', value: 'update_env_var_put' },
							// { name: 'Create Ssh-Key', value: 'create_ssh_key_post' },
							// { name: 'Show Ssh Keys', value: 'show_ssh_keys_get' },
							// { name: 'Create Subaccount', value: 'create_subaccount_post' },
							// { name: 'Set User', value: 'set_user_put' },
							// { name: 'Delete Api Key', value: 'delete_api_key_delete' },
							// { name: 'Show Api Key', value: 'show_api_key_get' },
							// { name: 'Delete Ssh Key', value: 'delete_ssh_key_delete' },
							// { name: 'Update Ssh Key', value: 'update_ssh_key_put' },
							// { name: 'Reset Api Key', value: 'reset_api_key_put' },
							{ name: 'Show Connections', value: 'show_connections_get' },
							// { name: 'Show Ipaddrs', value: 'show_ipaddrs_get' },
							{ name: 'Show Subaccounts', value: 'show_subaccounts_get' },
							// { name: 'Show Team Role', value: 'show_team_role_get' },
							{ name: 'Show User', value: 'show_user_get' },
							// { name: 'Transfer Credit', value: 'transfer_credit_put' },
						];
					case 'serverless':
						return [
							// { name: 'Create Autogroup', value: 'create_autogroup_post' },
							// { name: 'Show Autogroup', value: 'show_autogroup_get' },
							// { name: 'Create Endpoint', value: 'create_endpoint_post' },
							// { name: 'Show Endpoints', value: 'show_endpoints_get' },
							// { name: 'Delete Autogroup', value: 'delete_autogroup_delete' },
							// { name: 'Update Autogroup', value: 'update_autogroup_put' },
							// { name: 'Delete Endpoint', value: 'delete_endpoint_delete' },
							// { name: 'Update Endpoint', value: 'update_endpoint_put' },
							// { name: 'Get Autogroup Logs', value: 'get_autogroup_logs_post' },
							// { name: 'Get Autogroup Workers', value: 'get_autogroup_workers_post' },
							// { name: 'Get Endpoint Logs', value: 'get_endpoint_logs_post' },
							// { name: 'Get Endpoint Workers', value: 'get_endpoint_workers_post' },
							// { name: 'Route', value: 'route_post' },
						];
					case 'team':
						return [
							// { name: 'Create Team', value: 'create_team_post' },
							// { name: 'Create Team Role', value: 'create_team_role_post' },
							// { name: 'Destroy Team', value: 'destroy_team_delete' },
							// { name: 'Invite Team Member', value: 'invite_team_member_post' },
							// { name: 'Remove Team Member', value: 'remove_team_member_delete' },
							// { name: 'Remove Team Role', value: 'remove_team_role_delete' },
							// { name: 'Show Team Members', value: 'show_team_members_get' },
							// { name: 'Update Team Role', value: 'update_team_role_put' },
							// { name: 'Show Team Roles', value: 'show_team_roles_get' },
						];
					case 'template':
						return [
							// { name: 'Update Template', value: 'update_template_post' },
						];
					case 'search':
						return [
							// { name: 'Search Templates', value: 'search_templates_get' },
							// { name: 'Search Benchmarks', value: 'search_benchmarks_get' },
							// { name: 'Search Offers', value: 'search_offers_put' },
						];
					case 'volumes':
						return [
							// { name: 'Delete Volume', value: 'delete_volume_delete' },
							// { name: 'Rent Volume', value: 'rent_volume_put' },
							// { name: 'List Volumes', value: 'list_volumes_get' },
							// { name: 'Search Volumes', value: 'search_volumes_post' },
							// { name: 'Unlist Volume', value: 'unlist_volume_post' },
						];
					case 'billing':
						return [
							// { name: 'Search Invoices', value: 'search_invoices_get' },
							// { name: 'Show Deposit', value: 'show_deposit_get' },
							// { name: 'Show Earnings', value: 'show_earnings_get' },
							// { name: 'Show Invoice', value: 'show_invoice_get' },
						];
					default:
						return [];
				}
			},
			async getApiParams(this: ILoadOptionsFunctions) {
				const api = this.getCurrentNodeParameter('api');
				switch (api) {
					// Instances cases
					case 'attach_ssh_key_post':
						return [];
					case 'cancel_copy_delete':
						return [];
					case 'copy_put':
						return [];
					case 'cancel_sync_delete':
						return [];
					case 'cloud_copy_post':
						return [];
					case 'change_bid_put':
						return [];
					case 'create_instance_put':
						return [];
					case 'destroy_instance_delete':
						return [];
					case 'manage_instance_put':
						return [];
					case 'show_instance_get':
						return [];
					case 'detach_ssh_key_delete':
						return [];
					case 'execute_put':
						return [];
					case 'show_logs_put':
						return [];
					case 'prepay_instance_put':
						return [];
					case 'reboot_instance_put':
						return [];
					case 'recycle_instance_put':
						return [];
					case 'show_ssh_keys_get':
						return [];
					case 'show_instances_get':
						return [];

					// Machines cases
					case 'cancel_maint_put':
						return [];
					case 'cleanup_machine_put':
						return [];
					case 'list_machine_put':
						return [];
					case 'remove_defjob_delete':
						return [];
					case 'show_reports_get':
						return [];
					case 'schedule_maint_put':
						return [];
					case 'set_defjob_put':
						return [];
					case 'set_min_bid_put':
						return [];
					case 'show_machines_get':
						return [];
					case 'unlist_machine_delete':
						return [];

					// Accounts cases
					case 'create_api_key_post':
						return [];
					case 'show_api_keys_get':
						return [];
					case 'create_env_var_post':
						return [];
					case 'delete_env_var_delete':
						return [];
					case 'show_env_vars_get':
						return [];
					case 'update_env_var_put':
						return [];
					case 'create_ssh_key_post':
						return [];
					case 'show_ssh_keys_get':
						return [];
					case 'create_subaccount_post':
						return [];
					case 'set_user_put':
						return [];
					case 'delete_api_key_delete':
						return [];
					case 'show_api_key_get':
						return [];
					case 'delete_ssh_key_delete':
						return [];
					case 'update_ssh_key_put':
						return [];
					case 'reset_api_key_put':
						return [];
					case 'show_connections_get':
						return [];
					case 'show_ipaddrs_get':
						return [];
					case 'show_subaccounts_get':
						return [];
					case 'show_team_role_get':
						return [];
					case 'show_user_get':
						return [];
					case 'transfer_credit_put':
						return [];

					// Serverless cases
					case 'create_autogroup_post':
						return [];
					case 'show_autogroup_get':
						return [];
					case 'create_endpoint_post':
						return [];
					case 'show_endpoints_get':
						return [];
					case 'delete_autogroup_delete':
						return [];
					case 'update_autogroup_put':
						return [];
					case 'delete_endpoint_delete':
						return [];
					case 'update_endpoint_put':
						return [];
					case 'get_autogroup_logs_post':
						return [];
					case 'get_autogroup_workers_post':
						return [];
					case 'get_endpoint_logs_post':
						return [];
					case 'get_endpoint_workers_post':
						return [];
					case 'route_post':
						return [];

					// Team cases
					case 'create_team_post':
						return [];
					case 'create_team_role_post':
						return [];
					case 'destroy_team_delete':
						return [];
					case 'invite_team_member_post':
						return [];
					case 'remove_team_member_delete':
						return [];
					case 'remove_team_role_delete':
						return [];
					case 'show_team_members_get':
						return [];
					case 'update_team_role_put':
						return [];
					case 'show_team_roles_get':
						return [];

					// Template cases
					case 'update_template_post':
						return [];

					// Search cases
					case 'search_templates_get':
						return [];
					case 'search_benchmarks_get':
						return [];
					case 'search_offers_put':
						return [];

					// Volumes cases
					case 'delete_volume_delete':
						return [];
					case 'rent_volume_put':
						return [];
					case 'list_volumes_get':
						return [];
					case 'search_volumes_post':
						return [];
					case 'unlist_volume_post':
						return [];

					// Billing cases
					case 'search_invoices_get':
						return [];
					case 'show_deposit_get':
						return [];
					case 'show_earnings_get':
						return [];
					case 'show_invoice_get':
						return [];

					default:
						return [];
				}
			}
		}
	}

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const endPoint: string = "https://console.vast.ai/api/v0";
		const apisMap: Record<string, string> = {
			// Instances
			"attach_ssh_key_post": "",
			"cancel_copy_delete": "",
			"copy_put": "",
			"cancel_sync_delete": "",
			"cloud_copy_post": "",
			"change_bid_put": "",
			"create_instance_put": "",
			"destroy_instance_delete": "",
			"manage_instance_put": "",
			"show_instance_get": "",
			"detach_ssh_key_delete": "",
			"execute_put": "",
			"show_logs_put": "",
			"prepay_instance_put": "",
			"reboot_instance_put": "",
			"recycle_instance_put": "",
			"show_ssh_keys_get": "",
			"show_instances_get": "",

			// Machines
			"cancel_maint_put": "",
			"cleanup_machine_put": "",
			"list_machine_put": "",
			"remove_defjob_delete": "",
			"show_reports_get": "",
			"schedule_maint_put": "",
			"set_defjob_put": "",
			"set_min_bid_put": "",
			"show_machines_get": "",
			"unlist_machine_delete": "",

			// Accounts
			"create_api_key_post": "",
			"show_api_keys_get": "/auth/apikeys/",
			"create_env_var_post": "",
			"delete_env_var_delete": "",
			"show_env_vars_get": "/secrets/",
			"update_env_var_put": "",
			"create_ssh_key_post": "",
			"create_subaccount_post": "",
			"set_user_put": "",
			"delete_api_key_delete": "",
			"show_api_key_get": "",
			"delete_ssh_key_delete": "",
			"update_ssh_key_put": "",
			"reset_api_key_put": "",
			"show_connections_get": "/users/cloud_integrations/",
			"show_ipaddrs_get": "",
			"show_subaccounts_get": "/subaccounts/",
			"show_team_role_get": "",
			"show_user_get": "/users/current/",
			"transfer_credit_put": "",

			// Serverless
			"create_autogroup_post": "",
			"show_autogroup_get": "",
			"create_endpoint_post": "",
			"show_endpoints_get": "",
			"delete_autogroup_delete": "",
			"update_autogroup_put": "",
			"delete_endpoint_delete": "",
			"update_endpoint_put": "",
			"get_autogroup_logs_post": "",
			"get_autogroup_workers_post": "",
			"get_endpoint_logs_post": "",
			"get_endpoint_workers_post": "",
			"route_post": "",

			// Team
			"create_team_post": "",
			"create_team_role_post": "",
			"destroy_team_delete": "",
			"invite_team_member_post": "",
			"remove_team_member_delete": "",
			"remove_team_role_delete": "",
			"show_team_members_get": "",
			"update_team_role_put": "",
			"show_team_roles_get": "",

			// Template
			"update_template_post": "",

			// Search
			"search_templates_get": "",
			"search_benchmarks_get": "",
			"search_offers_put": "",

			// Volumes
			"delete_volume_delete": "",
			"rent_volume_put": "",
			"list_volumes_get": "",
			"search_volumes_post": "",
			"unlist_volume_post": "",

			// Billing
			"search_invoices_get": "",
			"show_deposit_get": "",
			"show_earnings_get": "",
			"show_invoice_get": ""
		};
		const apisReqMethodMap: Record<string, IHttpRequestMethods> = {
			// Instances
			"attach_ssh_key_post": "POST",
			"cancel_copy_delete": "DELETE",
			"copy_put": "PUT",
			"cancel_sync_delete": "DELETE",
			"cloud_copy_post": "POST",
			"change_bid_put": "PUT",
			"create_instance_put": "PUT",
			"destroy_instance_delete": "DELETE",
			"manage_instance_put": "PUT",
			"show_instance_get": "GET",
			"detach_ssh_key_delete": "DELETE",
			"execute_put": "PUT",
			"show_logs_put": "PUT",
			"prepay_instance_put": "PUT",
			"reboot_instance_put": "PUT",
			"recycle_instance_put": "PUT",
			"show_ssh_keys_get": "GET",
			"show_instances_get": "GET",

			// Machines
			"cancel_maint_put": "PUT",
			"cleanup_machine_put": "PUT",
			"list_machine_put": "PUT",
			"remove_defjob_delete": "DELETE",
			"show_reports_get": "GET",
			"schedule_maint_put": "PUT",
			"set_defjob_put": "PUT",
			"set_min_bid_put": "PUT",
			"show_machines_get": "GET",
			"unlist_machine_delete": "DELETE",

			// Accounts
			"create_api_key_post": "POST",
			"show_api_keys_get": "GET",
			"create_env_var_post": "POST",
			"delete_env_var_delete": "DELETE",
			"show_env_vars_get": "GET",
			"update_env_var_put": "PUT",
			"create_ssh_key_post": "POST",
			"create_subaccount_post": "POST",
			"set_user_put": "PUT",
			"delete_api_key_delete": "DELETE",
			"show_api_key_get": "GET",
			"delete_ssh_key_delete": "DELETE",
			"update_ssh_key_put": "PUT",
			"reset_api_key_put": "PUT",
			"show_connections_get": "GET",
			"show_ipaddrs_get": "GET",
			"show_subaccounts_get": "GET",
			"show_team_role_get": "GET",
			"show_user_get": "GET",
			"transfer_credit_put": "PUT",

			// Serverless
			"create_autogroup_post": "POST",
			"show_autogroup_get": "GET",
			"create_endpoint_post": "POST",
			"show_endpoints_get": "GET",
			"delete_autogroup_delete": "DELETE",
			"update_autogroup_put": "PUT",
			"delete_endpoint_delete": "DELETE",
			"update_endpoint_put": "PUT",
			"get_autogroup_logs_post": "POST",
			"get_autogroup_workers_post": "POST",
			"get_endpoint_logs_post": "POST",
			"get_endpoint_workers_post": "POST",
			"route_post": "POST",

			// Team
			"create_team_post": "POST",
			"create_team_role_post": "POST",
			"destroy_team_delete": "DELETE",
			"invite_team_member_post": "POST",
			"remove_team_member_delete": "DELETE",
			"remove_team_role_delete": "DELETE",
			"show_team_members_get": "GET",
			"update_team_role_put": "PUT",
			"show_team_roles_get": "GET",

			// Template
			"update_template_post": "POST",

			// Search
			"search_templates_get": "GET",
			"search_benchmarks_get": "GET",
			"search_offers_put": "PUT",

			// Volumes
			"delete_volume_delete": "DELETE",
			"rent_volume_put": "PUT",
			"list_volumes_get": "GET",
			"search_volumes_post": "POST",
			"unlist_volume_post": "POST",

			// Billing
			"search_invoices_get": "GET",
			"show_deposit_get": "GET",
			"show_earnings_get": "GET",
			"show_invoice_get": "GET"
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const selectedApi = this.getNodeParameter('api', itemIndex) as string;
				let url: string = `${endPoint}${apisMap[selectedApi]}`;
				let method: IHttpRequestMethods = apisReqMethodMap[selectedApi];

				// Lấy credentials đã được mã hóa
				const credentials = await this.getCredentials('vastAICredentialsApi');

				// Tùy chọn cho yêu cầu HTTP
				const requestOptions: IHttpRequestOptions = {
					method: method,
					url: url,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${credentials.apiKey}`,
					},
					json: true,
				};

				// Gọi API bằng httpRequest của n8n
				const response = (await this.helpers.httpRequest.call(this, requestOptions)) as any;

				returnData.push({
					json: response,
				});
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}

// import { Incantation, ArgIncantation, type GLOBAL, type LOCAL, type EXPR } from "../incantation";

// import type { DesmostOptions } from "../../options";
// import { DesmostError, type Fallible } from "../../errors";
// import { Ast } from "../../parser";


// export class ?Incantation extends ArgIncantation<?>
// {
// 	override readonly effect       = Incantation.Effect.?
// 	override readonly identifier   = ?
// 	override readonly requires_arg = ?
// 	override readonly arg_type     = Incantation.ArgType.?
// 	override readonly description
//    	= ""

// 	override apply(target: ?, data: ?)
// 	{
// 		// TODO
// 	}

// 	override evaluate_arg(raw: ?, options: DesmostOptions): Fallible<?>
// 	{
// 		let out = super.evaluate_arg(raw, options) as ?;

// 		if (options.check_args) {
// 			// TODO
// 		}

// 		return out;
// 	}

// 	override extract(target: ?): Ast.IncantationInvocation<?> | void
// 	{
// 		// TODO
// 	}
// }

// export const ? = new ?Incantation();

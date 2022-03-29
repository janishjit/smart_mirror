/*
 * common.h
 *
 *  Created on: Mar 26, 2022
 *      Author: TrevorFlanigan
 */

#ifndef COMMON_H_
#define COMMON_H_

#define TRUE 1
#define FALSE 0

#define MAX_CHARS 30

/*
 * Possible exit statuses that can be received from running a lua script on rfs
 */
#define LUA_EXIT_SUCCESS 0
#define LUA_HTTP_ERROR 1
#define LUA_RESPONSE_ITERATION_OVERFLOW 2
#define LUA_RESPONSE_TIMEOUT 4
#define LUA_RESPONSE_TBC 9

#endif /* COMMON_H_ */

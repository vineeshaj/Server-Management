package main

import (
	_ "github.com/lib/pq"
	ia "servermanagement.com/infraadmin/asset"
)

func main() {
	ia.HandleFunc()

}

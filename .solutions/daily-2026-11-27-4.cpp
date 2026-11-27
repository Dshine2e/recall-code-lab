#include <bits/stdc++.h>
using namespace std;

int main() {
    const long long MOD = 1000000007LL;
    string s;
    getline(cin, s);
    vector<long long> nums;
    vector<char> ops;
    long long cur = 0;
    bool have = false;
    for (char c : s) {
        if (isdigit((unsigned char)c)) {
            cur = cur * 10 + (c - '0');
            have = true;
        } else if (c == '+' || c == '-' || c == '*') {
            nums.push_back(cur % MOD);
            ops.push_back(c);
            cur = 0;
            have = false;
        }
    }
    if (have) nums.push_back(cur % MOD);
    long long ans = 0, term = nums[0];
    int sign = 1;
    for (size_t i = 0; i < ops.size(); i++) {
        if (ops[i] == '*') {
            term = term * nums[i + 1] % MOD;
        } else {
            ans = (ans + sign * term) % MOD;
            sign = ops[i] == '+' ? 1 : -1;
            term = nums[i + 1];
        }
    }
    ans = (ans + sign * term) % MOD;
    ans = (ans % MOD + MOD) % MOD;
    cout << ans << '\n';
    return 0;
}
